import { htm as html } from '@zeit/integration-utils'
import rateLimiting from './plugins/rateLimiting';
import basicAuth from './plugins/basicAuth';
import dashboardView from './dashboard'

export default async function pluginView (viewData) {
  const { payload, routeId: _routeId  } = viewData;
  const routeId = _routeId || payload.clientState.routeId
  
  console.log(routeId, _routeId)
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
  } else if (payload.action === 'done') {
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
                    <Box display="none">
                      <Input hidden width='500px' name="routeId" value=${routeId || ''}/>
                    </Box>
                    <Button action="rateLimiting">Rate Limiting</Button>
                  </FsContent>
                  <FsContent>
                    <Notice type="message">More plugins coming soon...</Notice>
                  </FsContent>
              </Fieldset>
              ${payload.action === 'pluginConfigured' ? 
              html`<Button action="done">Done Configuring Plugins</Button>`
              : '' } 
          </Box>
      `
}
