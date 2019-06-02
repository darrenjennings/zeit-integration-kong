import KongClient from '../lib/kong-client';
import projectsView from './projects';


export default async function setupView (viewData) {
  const { payload, zeitClient } = viewData;
  const { kongAdminApiUrl, apiKey } = payload.clientState;

  let error = null;
  if (payload.action === 'setup') {
    if (!kongAdminApiUrl || !apiKey) {
      error = 'Both "Kong Admin URL" and "Kong API Key" are required.';
    } else {
      const kongClient = new KongClient({ url: kongAdminApiUrl, apiKey });
      viewData.kongClient = kongClient;
      const authChecked = await kongClient.authCheck();
      if (authChecked) {
        zeitClient.setMetadata({
          connectionInfo: {
            kongAdminApiUrl, 
            apiKey
          }
        })
        return projectsView(viewData)
      }

      error = 'Either "Kong URL" or "Kong API Key" is incorrect.';
    }
  }

  return `
        <Box>
            <Fieldset>
                <FsContent>
                    <H1>Kong API Integration</H1>
                </FsContent>
                <FsContent>
                    <FsTitle>Your Kong URL</FsTitle>
                    <FsSubtitle>This is the url of your Kong admin server.</FsSubtitle>
                    <Input width='500px' name="kongAdminApiUrl" value="${kongAdminApiUrl || ''}"/>
                </FsContent>
            </Fieldset>
            <Fieldset>
                <FsContent>
                    <FsTitle>Your Kong API Key</FsTitle>
                    <Input width='500px' name="apiKey" value="${apiKey || ''}"/>
                </FsContent>
            </Fieldset>
            ${error ? `<Box color="red" marginBottom="20px">${error}</Box>` : ''}        
            <Button action="setup">Setup</Button>
		</Box>
    `
}
