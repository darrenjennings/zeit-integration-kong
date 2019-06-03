import { htm as html } from '@zeit/integration-utils'
import KongClient from '../lib/kong-client';
import projectsView from './projects';

export default async function setupView (viewData) {
  const { payload, zeitClient } = viewData;
  const { kongAdminApiUrl, apiKey } = payload.clientState;

  let error = null;
  if (payload.action === 'setup') {
    if (!kongAdminApiUrl || !apiKey) {
      error = 'Please fill out all required fields.';
    } else {
      const connectionInfo = { url: kongAdminApiUrl, apiKey }
      const kongClient = new KongClient(connectionInfo);
      
      viewData.kongClient = kongClient;
      const authChecked = await kongClient.authCheck();
      if (authChecked) {
        zeitClient.setMetadata({ connectionInfo })
        return projectsView(viewData)
      }

      error = 'Could not connect to Kong with these values. Please check inputs.';
    }
  }

  return html`
        <Box>
            <Fieldset>
                <FsContent>
                    <H1>Kong API Integration</H1>
                    <FsSubtitle>
                      Welcome to the Kong ZEIT Now integration. You will need to have a running instance of <Link href="https://docs.konghq.com/" target="_blank">Kong</Link>
                      publicly available with the Admin API secured via the Key Authentication loopback method. <Link href="https://docs.konghq.com/1.1.x/secure-admin-api/#kong-api-loopback" target="_blank">Read more here</Link><BR/>
                      <BR/>We recommend trying it out on Heroku if you want to take it for a quick test run: <Link href="https://dashboard.heroku.com/new?template=https://github.com/heroku/heroku-kong/tree/kong-1.1.0" target="_blank">Deploy to Heroku</Link>
                    </FsSubtitle>
                </FsContent>
                <FsContent>
                    <FsTitle>Your Kong URL</FsTitle>
                    <FsSubtitle>This is the url of your Kong Admin API (e.g. https://djkong-zeit.herokuapp.com/kong-admin)</FsSubtitle>
                    <Input width='500px' name="kongAdminApiUrl" value=${kongAdminApiUrl || ''}/>
                    <BR />
                    <FsTitle>Your Kong API Key</FsTitle>
                    <Input width='500px' name="apiKey" value=${apiKey || ''} />
                </FsContent>
                <FsFooter>
                  <Button action="setup">Next</Button>
                </FsFooter>
            </Fieldset>
                  ${error ? html`<Box color="red" marginBottom="20px">${error}</Box>` : ''}
		</Box>
    `
}
