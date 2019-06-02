import { htm } from '@zeit/integration-utils'
import setupView from './setup';
import servicesView from './services';

export default async function projectsView (viewData) {
  const { payload, metadata, zeitClient } = viewData;
  const { kongAdminApiUrl, apiKey } = payload.clientState;

  const linkArray = payload.action.split('-')

  if (linkArray.length === 2 && linkArray[0] === 'choose') {
    return servicesView(viewData)
  }

  let apiUrl = `/v1/projects/list`;
  const projects = await zeitClient.fetchAndThrow(apiUrl, { method: 'GET' });
  const getTimestamp = (unix) => {
    const date = new Date(unix)
    return date.toUTCString();
  }
  
  return `
  <Page>
    <H1>What project do you want to set up with Kong?</H1>
    <BR/>
    <Box border="1px solid" padding="1rem" borderRadius="5px" borderColor="hsla(205, 100%, 72%, 1)">
      <UL>
        ${projects.map(d => `
          <Container>
            <Link action="choose-${d.id}">${d.name}</Link>
            <Box color="hsla(0, 0%, 0%, 0.5)">Created: ${getTimestamp(d.createdAt)}, Last Updated: ${getTimestamp(d.updatedAt)}</Box>
          </Container>`
  ).join('')}
      </UL>
    </Box>
  </Page>`
}
