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

  return `
  <Box>
    <Fieldset>
      <FsContent>
        <H1>What project do you want to set up with Kong?</H1>
      </FsContent>
      <FsContent>
        ${projects.map(d => `<Link action="choose-${d.id}" ><H2>${d.name}</H2></Link><BR />`)}
      </FsContent>
    </Fieldset>
  </Box>`
}
