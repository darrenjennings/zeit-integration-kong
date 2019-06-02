import { withUiHook } from '@zeit/integration-utils';

import setupView from './src/views/setup';
import deploymentsView from './src/views/deployments';
import servicesView from './src/views/services.js';
import rateLimiting from './src/views/plugins/rateLimiting';


// import newClusterView from './views/new-cluster';
// import KongClient from '..kong-client.js';
// import dashboardView from './views/dashboard';

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
        // return deploymentsView(viewData);
    }
    //     return deploymentsView(viewData)
    // }
    if (payload.action === 'setup') {
        return deploymentsView(viewData)
    }

    if (payload.action.split('-')[0] === 'choose') {
        return servicesView(viewData)
    }

    if (payload.action === 'rateLimiting') {
        return rateLimiting(viewData)
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