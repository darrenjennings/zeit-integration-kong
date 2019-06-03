import { htm as html } from '@zeit/integration-utils'
import { StatusDot } from '../components/UI'
import servicesView from './services';

export default async function projectsView (viewData) {
  const { payload, metadata, zeitClient, kongClient } = viewData;
  const linkArray = payload.action.split('-')
  
  if (linkArray.length === 2 && linkArray[0] === 'choose') {
    return servicesView(viewData)
  }
  
  const apiUrl = `/v1/projects/list`;
  const projects = await zeitClient.fetchAndThrow(apiUrl, { method: 'GET' });
  
  let error = ''
  for(let i=0; i < projects.length; ++i){
    projects[i].kong = {}
    try{
      const res = await kongClient.fetchEntity(`services/ZEIT-${projects[i].id}`, 'GET')
      const service = await res.data
      if (service.id) {
        projects[i].kong.service = service
      }
    } catch (e) {
      error += "Could not connect to Kong. Please check Kong instance and maybe try resetting your Kong Connection info."
      break;
    }
  }
  
  const getTimestamp = (unix) => {
    const date = new Date(unix)
    return date.toUTCString();
  }  
  
  const top = html`<H1>What project do you want to proxy traffic with Kong?</H1>
  <BR/>
  <Box border="1px solid" padding="1rem" borderRadius="5px" borderColor="hsla(205, 100%, 72%, 1)">
    <UL>
      ${projects.map((p, idx) => html`
          <Container>
            <Box borderBottom=${idx !== projects.length - 1 ? '1px solid lightgray' : ''} padding="15px 0">
              <Link action=${`choose-${p.id}`}>${p.name}</Link>
              <Box display="flex" align-items="center" height="14px" marginTop="10px">
                <${StatusDot} color=${p.kong && p.kong.service ? 'green' : 'red'} />
                <B>${p.kong && p.kong.service ? 'Proxied by Kong' : 'Not Proxied by Kong'}</B>
              </Box>
              <Box color="hsla(0, 0%, 0%, 0.5)">Created: ${getTimestamp(p.createdAt)}, Last Updated: ${getTimestamp(p.updatedAt)}</Box>
            </Box>
          </Container>`
      )}
    </UL>
  </Box>`
  
  return html`
  <Page>
    ${error ? html`<Box color="red" marginBottom="20px">${error}</Box>` : top}
    <Box display=${metadata.connectionInfo ? 'flex' : 'none'} marginTop="1rem">
      <Link action="reset">Reset Kong Connection</Button>
    </Box>
  </Page>`
}
