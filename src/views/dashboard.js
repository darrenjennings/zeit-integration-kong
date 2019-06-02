import KongClient from '../lib/kong-client';
import deploymentsView from './deployments';

console.log("dashboardView")

// console.log(kongAdminApiUrl)
// const kongClient = new KongClient({ url: kongAdminApiUrl, apiKey });
// viewData.kongClient = kongClient;
// const authChecked = await kongClient.fetchAndThrow('', {});
// if (authChecked) { // If the API key and URL are good, go to the next view
// console.log(authChecked)
// metadata.connectionInfo = { kongAdminApiUrl, apiKey };
// await zeitClient.setMetadata(metadata);



export default async function dashboardView (viewData) {
  const { payload, metadata, zeitClient } = viewData;
  const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition

  let error = null;
  if (payload.action === 'setup') {
    if (!kongAdminApiUrl || !apiKey) {
      error = 'Both "Kong Admin URL" and "Kong API Key" are required.';
    } else {
      console.log(kongAdminApiUrl)
      const kongClient = new KongClient({ url: kongAdminApiUrl, apiKey });
      viewData.kongClient = kongClient;
      const authChecked = await kongClient.fetchAndThrow('', {});
      if (authChecked) { // If the API key and URL are good, go to the next view
        console.log(authChecked)
        metadata.connectionInfo = { kongAdminApiUrl, apiKey };
        await zeitClient.setMetadata(metadata);
        return `
        <UL>
          ${Object.keys(authChecked.plugins.available_on_server).map(plugin => `<LI>${plugin}</LI>`)}
        </UL>
        `
        // return deploymentsView(viewData)
      }

      error = 'Either "Kong URL" or "Kong API Key" is incorrect.';
    }
  }

  return `
        <Box>
            <Fieldset>
                <FsContent>
                    <H1>Kong API Dashboard</H1>
                </FsContent>

                <FsContent>
                    <FsTitle>Your Kong plugins</FsTitle>
                    
                </FsContent>
            </Fieldset>
		</Box>
    `
}
