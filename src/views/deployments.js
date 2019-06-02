import setupView from './setup';
import servicesView from './services';

console.log("deploymentsView")

export default async function deploymentsView(viewData) {
    const { payload, metadata, zeitClient } = viewData;
    const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition
    const {projectId} = payload;
    console.log("deploymentsView payload.action", payload.action)

    const linkArray = payload.action.split('-')

    if (linkArray.length === 2 && linkArray[0] === 'choose') {
        console.log("deploymentsView You chose wisely")
        
        console.log(linkArray[1])

        return servicesView(viewData)
    }

    let apiUrl = `/v1/projects/list`;
    const projects = await zeitClient.fetchAndThrow(apiUrl, {method: 'GET'});
    
    console.log("projects", projects)
    // resp [ { accountId: 'Vf7L1UDUyDeS6qbuU2UwIKlb',
    // createdAt: 1559425099864,
    // id: 'QmTkZiyocquDsWziBRfNuc88AAYTU3ch2UN8XyuYFJPsDp',
    // name: 'src',
    // updatedAt: 1559425099841 } ]
    // const urls = deployments.map(d => `https://${d.url}`)
    
    // console.log("urls", urls)
    // console.log("projectId", projectId)

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
            </Box>
        `
}
