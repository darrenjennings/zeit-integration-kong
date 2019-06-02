import { withUiHook } from '@zeit/integration-utils';

import setupView from './src/views/setup';
import projectsView from './src/views/projects';
import servicesView from './src/views/services';
import pluginView from './src/views/plugin.js';


// Plugins
import rateLimiting from './src/views/plugins/rateLimiting';
import basicAuth from './src/views/plugins/basicAuth';

import dashboardView from './src/views/dashboard';
// import newClusterView from './views/new-cluster';
import KongClient from './src/lib/kong-client.js';

async function getContent (options) {
    const { payload, zeitClient } = options;

    const metadata = await zeitClient.getMetadata();
    const viewData = { metadata, zeitClient, payload };

    console.log(payload.action, 'split: ', payload.action.split('-')[0])
    console.log("metadata", metadata)

    // First time setup
    if (!metadata.connectionInfo) {
        return setupView(viewData);
    }
    
    const client = new KongClient(metadata.connectionInfo);
    viewData.client = client
  
    if (payload.action === 'setup' || payload.action === "view") {
    return projectsView(viewData)
    }

    if (payload.action.split('-')[0] === 'choose') {
    return servicesView(viewData)
    }

    // Service URL set. Choose Which Plugin to configure
    if (payload.action === 'serviceUrl' || payload.action === 'pluginConfigured') {
    return pluginView(viewData)
    }

    // Done configuring plugins. Go to the dashboard
    if (payload.action === 'done') {
        return dashboardView(viewData)
    }

    // Choose to configure the Rate Limiting Plugin.
    if (payload.action === 'rateLimiting') {
    return rateLimiting(viewData)
    }

    // Choose to configure the Basic Authentication Plugin.
    if (payload.action === 'basicAuth') {
        return basicAuth(viewData)
    }
}

const handler = async (options) => {
  const jsx = await getContent(options);
  return `
        <Page>
            ${jsx}
		</Page>`;
};

export default withUiHook(handler);
