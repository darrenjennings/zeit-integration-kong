// import setupView from './setup';
import { htm as html } from '@zeit/integration-utils'
import pluginView from './plugin';

export default async function servicesView (viewData) {
  console.log(viewData)
  const { payload, kongClient } = viewData;
  const { serviceUrl, servicePath, routePath, projectId: _projectId } = payload.clientState

  const projectId = _projectId || payload.action.split("-")[1]

  let error = '';

  if (!serviceUrl && payload.action === 'services') {
    error += 'Please enter service URL';
  } else if (serviceUrl) {
    const serviceResp = await kongClient.fetchEntity('services', 'POST', {
      name: `ZEIT-${projectId}`,
      path: servicePath,
      url: serviceUrl
    })

    if (serviceResp.status != 201) {
      error += 'Error creating service ' + serviceResp.status;
    } else {
      const routeResp = await kongClient.fetchEntity(`services/ZEIT-${projectId}/routes`, 'POST', {
        paths: [routePath],
        methods: ["GET"],
        protocols: ["https"]
      })

      if (routeResp.status == 201) {
        console.log(routeResp.data)
        const route = await routeResp.data
        viewData.routeId = route.id
        return pluginView(viewData)
      }

      error += '<BR/>Error creating route ' + routeResp.status;
    }
  }

  const docsURLService = 'https://docs.konghq.com/latest/admin-api/#service-object'
  const docsURLRoute = 'https://docs.konghq.com/latest/admin-api/#route-object'
  console.log(error, payload)
  return html`
            <Box>
                <Fieldset>
                  <FsContent>
                    <H1>Service</H1>
                    <FsSubtitle>
                      <Link href=${docsURLService} target="_blank">Learn more about Kong Services</Link>
                      To Proxy ZEIT Now API requests through Kong, you have to let Kong know about them. Please fill out the 
                      below fields to add a service and associate route.
                    </FsSubtitle>
                  </FsContent>
                  <FsContent>
                    <FsTitle>URL</FsTitle>
                    <FsSubtitle>The URL of your ZEIT Now API (e.g. https://my-express-project-dcimj3h6p.now.sh/)</FsSubtitle>
                    <Input width='500px' name="serviceUrl" value=${serviceUrl || ''}/>
                  </FsContent>
                  <FsContent>
                    <FsTitle>Path</FsTitle>
                    <FsSubtitle>The path Kong will use in requests to the upstream ZEIT Now server.</FsSubtitle>
                    <Input width='500px' name="servicePath" value=${servicePath || ''}/>
                  </FsContent>
                </Fieldset>
                <Fieldset>
                  <FsContent>
                    <H1>Route</H1>
                    <FsSubtitle><Link href=${docsURLRoute} target="_blank">Learn more about Kong Routes</Link></FsSubtitle>
                  </FsContent>
                  <FsContent>
                    <FsTitle>Path</FsTitle>
                    <FsSubtitle>The path prefix that users of your API will use for Kong</FsSubtitle>
                    <Input width='500px' name="routePath" value=${routePath || ''}/>
                    <Box display="none">
                      <Input hidden width='500px' name="projectId" value=${projectId}/>
                    </Box>
                  </FsContent>
                </Fieldset>
                ${error ? html`<Box color="red" marginBottom="20px">${error}</Box>` : ''}
                <Button action="services">Submit</Button>
            </Box>
        `
}
