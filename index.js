import { withUiHook } from '@zeit/integration-utils';

import setupView from './src/views/setup';
import servicesView from './src/views/services';
// import deploymentsView from './src/views/deployments';


// import newClusterView from './views/new-cluster';
// import KongClient from '..kong-client.js';
// import dashboardView from './views/dashboard';

async function getContent(options) {
    console.log("getContent")
    const { payload, zeitClient } = options;
    const { action } = payload;
    
    const metadata = await zeitClient.getMetadata();
    const viewData = { metadata, zeitClient, payload };

    // First time setup
    if (!metadata.connectionInfo) {
        return setupView(viewData);
    }

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