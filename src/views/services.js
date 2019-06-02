// import setupView from './setup';
import pluginView from './plugin';

console.log("servicesView")

export default async function servicesView(viewData) {
    const { payload, metadata, zeitClient } = viewData;
    // const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition
    const {projectId} = payload;
    const serviceUrl = '';
    console.log("servicesView payload.action", payload.action)

    // const linkArray = payload.action.split('-')
    let error = null;
    if (!serviceUrl) {
        error = 'Please enter a service URL';
      } else {
        if (payload.action === 'serviceUrl') {
            console.log("You chose serviceUrl")
            

            return pluginView(viewData)
        }
      }
    return `
            <Box>
                <Fieldset>
                    <FsContent>
                        <H1>Service URL</H1>
                        <P>Before you can start making requests against the the Kong plugin, 
                        you will need to add a Route to it. Routes specify how (and if) 
                        requests are sent to their Services after they reach Kong. A 
                        single Service can have many Routes. Please enter your service URL. </P>
                    </FsContent>
                    <FsContent>
                        <FsTitle>Service URL</FsTitle>
                        <Input width='500px' name="serviceUrl" value="${serviceUrl || ''}"/>
                    </FsContent>
                </Fieldset>
                ${error ? `<Box color="red" marginBottom="20px">${error}</Box>`: '' }        
                <Button action="serviceUrl">Setup</Button>
            </Box>
        `
}
