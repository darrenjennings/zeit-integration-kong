import { htm as html } from '@zeit/integration-utils'
import KongClient from '../../lib/kong-client';
import pluginView from '../plugin';

export default async function basicAuth(viewData) {
  const { payload, metadata, zeitClient } = viewData;
  const docsURL = 'https://docs.konghq.com/hub/kong-inc/basic-auth/'

  let error = null;
  let username = null;
  let password = null;

  if (payload.action === 'pluginConfigured') {
    if (!username && !password) {
      error = 'Please enter a username and password.';
    } else {
        return pluginView(viewData)
    }

    error = 'Please enter all the required fields';
  }

  return html`
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
                <FsFooter>
                  <Button action="pluginConfigured">Setup Basic Authentication</Button>
                </FsFooter>
            </Fieldset>
            ${error ? `<Box color="red" marginBottom="20px">${error}</Box>`: '' }        
		</Box>
    `
}
