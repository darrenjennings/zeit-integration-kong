import { htm as html } from '@zeit/integration-utils'
import rateLimiting from './plugins/rateLimiting';
import basicAuth from './plugins/basicAuth';
import dashboardView from './dashboard'

export default async function pluginView (viewData) {
  const { payload, metadata, zeitClient } = viewData;
  const { projectId } = payload;
  console.log("pluginView payload.action", payload.action)

  if (payload.action === 'rateLimiting') {
    return rateLimiting(viewData)
  }

  if (payload.action === 'rateLimiting') {
    console.log("You chose rateLimiting")
    return rateLimiting(viewData)
  } else if (payload.action === 'basicAuth') {
    console.log("You chose basicAuth")
    return basicAuth(viewData)
  } else if (payload.action === 'done') { //Done configuring plugins
    console.log("You chose done")
    return dashboardView(viewData)
  }
  return html`
          <Box>
              <Fieldset>
                  <FsContent>
                      ${payload.action === 'pluginConfigured' ? 
                      html`<H1>Would you like to configure another plugin?</H1>`
                      : html`<H1>Please select a plugin that you want to set up.</H1>` } 
                      
                  </FsContent>
                  <FsContent>
                      <Button action="rateLimiting">Rate Limiting</Button>
                  </FsContent>
                  <FsContent>
                      <Button action="basicAuth">Basic Authentication</Button>
                  </FsContent>
              </Fieldset>
              ${payload.action === 'pluginConfigured' ? 
              `<Button action="done">Done Configuring Plugins</Button>`
              : '' } 
          </Box>
      `
}
