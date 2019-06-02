// import KongClient from '../lib/kong-client';
// import {withUiHook, htm} from '@zeit/integration-utils';

console.log("setupView")
export default async function setupView(viewData) {
    const { payload, metadata, zeitClient } = viewData;
    const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition
  
    let error = null;
    if (payload.action === 'setup') {
      if (!kongAdminApiUrl || !apiKey) {
        error = 'Both "Kong Admin URL" and "Kong API Key" are required.';
      } else {
        const kongClient = new KongClient({ kongAdminApiUrl, apiKey });
        viewData.kongClient = kongClient;
        const authChecked = await kongClient.authCheck();
        if (authChecked) { // If the API key and URL are good, go to the next view
          metadata.connectionInfo = { kongAdminApiUrl, apiKey };
          await zeitClient.setMetadata(metadata);
          return deploymentsView(viewData)
        }
  
        error = 'Either "Kong URL" or "Kong API Key" is incorrect.';
      }
}



let kongAdminApiUrl = '';
let apiKey = '';

	return `
        <Box>
            <Fieldset>
                <H1>Kong API Integration</H1>
            </Fieldset>

            <Fieldset>
                <FsContent>
                    <FsTitle>Your Kong URL</FsTitle>
                    <FsSubtitle>This is the url of your Kong admin server.</FsSubtitle>
                    <Input name="kongAdminApiUrl" value="${kongAdminApiUrl || ''}"/>
                </FsContent>
            </Fieldset>
            <Fieldset>
                <FsContent>
                    <FsTitle>Your Kong API Key</FsTitle>
                    <Input name="apiKey" value="${apiKey || ''}"/>
                </FsContent>
            </Fieldset>
            ${error ? htm`<Box color="red" marginBottom="20px">${error}</Box>`
                : ''
            }        
            <Button action="setup">Setup</Button>
		</Box>
    `
}
