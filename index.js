import { withUiHook } from '@zeit/integration-utils';

import setupView from './src/views/setup';
import projectsView from './src/views/projects';
import servicesView from './src/views/services';
import rateLimiting from './src/views/plugins/rateLimiting';

async function getContent (options) {
  const { payload, zeitClient } = options;

  const metadata = await zeitClient.getMetadata();
  const viewData = { metadata, zeitClient, payload };

  console.log(payload.action, 'split: ', payload.action.split('-')[0])

  // First time setup
  if (!metadata.connectionInfo || payload.action === "view") {
    return setupView(viewData);
  }

  if (payload.action === 'setup') {
    return projectsView(viewData)
  }

  if (payload.action.split('-')[0] === 'choose') {
    return servicesView(viewData)
  }

  // Service URL set. Choose Which Plugin to configure
  if (payload.action === 'serviceUrl' || payload.action === 'pluginConfigured') {
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
}

const handler = async (options) => {
  const jsx = await getContent(options);
  return `
        <Page>
            ${jsx}
		    </Page>`;
};

export default withUiHook(handler);
