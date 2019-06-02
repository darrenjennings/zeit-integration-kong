import { withUiHook } from '@zeit/integration-utils';

import setupView from './src/views/setup';
import deploymentsView from './src/views/deployments';
import servicesView from './src/views/services.js';
import pluginView from './src/views/plugin'

// Plugin Configuration
import rateLimiting from './src/views/plugins/rateLimiting';
import basicAuth from './src/views/plugins/basicAuth';

import dashboardView from './src/views/dashboard';
// import newClusterView from './views/new-cluster';
// import KongClient from '..kong-client.js';

async function getContent(options) {
    console.log("getContent")
    const { payload, zeitClient } = options;
    const { action } = payload;
    
    const metadata = await zeitClient.getMetadata();
    const viewData = { metadata, zeitClient, payload };

    console.log("payload.action", payload.action)
    // First time setup
    if (!metadata.connectionInfo || payload.action === "view") {
        return setupView(viewData);
    }

    // Kong URL and API key set. Choose Zeit Project.
    if (payload.action === 'setup') {
        return deploymentsView(viewData)
    }

    // Zeit project chosen. Set service URL
    if (payload.action.split('-')[0] === 'choose') {
        return servicesView(viewData)
    }

    // Service URL set. Choose Which Plugin to configure
    if (payload.action === 'serviceUrl' || payload.action === 'pluginConfigured' ) {
        return pluginView(viewData)
    }

    // Choose to configure the Rate Limiting Plugin.
    if (payload.action === 'rateLimiting') {
        return rateLimiting(viewData)
    }

    // Choose to configure the Basic Authentication Plugin.
    if (payload.action === 'basicAuth') {
        return basicAuth(viewData)
    }

    // Done configuring plugins. Go to the dashboard
    if (payload.action === 'done') {
        return dashboardView(viewData)
    }

    console.log("metadata", metadata)

    // if (action === 'new-cluster') {
    //     return newClusterView(viewData);
    // }

    // viewData.KongClient = new KongClient(metadata.connectionInfo);
    // return dashboardView(viewData);
}

const handler = async (options) => {
  const jsx = await getContent(options);
  return `
        <Page>
            ${jsx}
		</Page>
        `;
    };
    
export default withUiHook(handler);