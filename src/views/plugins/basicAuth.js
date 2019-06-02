import KongClient from '../../lib/kong-client';
import pluginView from '../plugin';

console.log("basicAuth")
export default async function basicAuth(viewData) {
  const { payload, metadata, zeitClient } = viewData;
  const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition
    const docsURL = 'https://docs.konghq.com/hub/kong-inc/basic-auth/'

  let error = null;
  let username = null;
  let password = null;

  if (payload.action === 'pluginConfigured') {
    if (!username && !password) {
      error = 'Please enter a username and password.';
    } else {
    //   console.log(kongAdminApiUrl)
    //   const kongClient = new KongClient({ url: kongAdminApiUrl, apiKey });
    //   viewData.kongClient = kongClient;
    //   const authChecked = await kongClient.fetchAndThrow('', {});
    //   if (authChecked) { // If the API key and URL are good, go to the next view
    //     console.log(authChecked)
    //     metadata.connectionInfo = { kongAdminApiUrl, apiKey };
    //     await zeitClient.setMetadata(metadata);
    //     return `
    //     <UL>
    //       ${Object.keys(authChecked.plugins.available_on_server).map(plugin => `<LI>${plugin}</LI>`)}
    //     </UL>
    //     `
      return pluginView(viewData)

    //     // return deploymentsView(viewData)
    //   }

      error = 'Please enter all the required fields';
    }
  }

  return `
        <Box>
            <Fieldset>
                <FsContent>
                    <H1>Basic Authentication</H1>
                    <FsSubtitle><Link href="${docsURL}" target="_blank">Kong Documentation</Link></FsSubtitle>
                    <P>Add Basic Authentication to a Service or a Route with username and password protection. 
                    The plugin will check for valid credentials in the Proxy-Authorization and Authorization 
                    header (in this order). We will be creating the consumer and the credential with the same
                    username and password. 
                    </P>
                </FsContent>
                <FsContent>
                    <FsTitle>Username</FsTitle>
                    <FsSubtitle>The username for the consumer / credential.</FsSubtitle>
                    <Input name="username" value="${username || ''}"/>
                </FsContent>
                    <FsContent>
                    <FsTitle>Password</FsTitle>
                    <FsSubtitle>The password for the consumer / credential.</FsSubtitle>
                    <Input name="password" value="${password || ''}"/>
                </FsContent>
            </Fieldset>
            ${error ? `<Box color="red" marginBottom="20px">${error}</Box>`: '' }        
            <Button action="pluginConfigured">Setup</Button>
		</Box>
    `
}
