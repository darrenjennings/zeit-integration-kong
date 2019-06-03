import { htm as html } from '@zeit/integration-utils'
import rateLimiting from './plugins/rateLimiting';
import basicAuth from './plugins/basicAuth';
import dashboardView from './dashboard'

export default async function pluginView (viewData) {
  const { payload, routeId: _routeId  } = viewData;
  const routeId = _routeId || payload.clientState.routeId
  const rateURL = 'https://docs.konghq.com/hub/kong-inc/rate-limiting/'
  const authURL = 'https://docs.konghq.com/hub/kong-inc/basic-auth/'
  
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
                      : html`<H1>Please select a Kong plugin that you want to set up.</H1>` } 
                      
                  </FsContent>
                  <FsContent>
                    <Box display="none">
                      <Input hidden width='500px' name="routeId" value=${routeId || ''}/>
                    </Box>
                    <FsTitle>Configure Rate Limiting</FsTitle>
                        <FsSubtitle><Link href="${rateURL}" target="_blank">Kong Documentation</Link><BR />
                        Rate limit how many HTTP requests a developer can make in a given
                        period of seconds, minutes, hours, days, months or years.
                        </FsSubtitle>
                        <Button action="rateLimiting">Rate Limiting</Button>
                  </FsContent>
                  <FsContent>
                    <Notice type="message">More plugins coming soon...</Notice>
                  </FsContent>
                  <FsFooter>
                    ${payload.action === 'pluginConfigured' ? 
                    html`<Button action="done">Done Configuring Plugins</Button>`
                    : '' } 
                  </FsFooter>
              </Fieldset>

          </Box>
      `
}
