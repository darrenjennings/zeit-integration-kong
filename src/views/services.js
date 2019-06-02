// import setupView from './setup';
import rateLimiting from './plugins/rateLimiting';

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
        error = 'Please enter service URL';
      } else {
        if (payload.action === 'service') {
            console.log("You chose service")
            

            return rateLimiting(viewData)
        }
      }
    return `
            <Box>
                <Fieldset>
                    <FsContent>
                        <H1>Service URL</H1>
                        <P>Please enter your service URL</P>
                    </FsContent>
                    <FsContent>
                        <FsTitle>Service URL</FsTitle>
                        <FsSubtitle>This is the url of your Kong admin server.</FsSubtitle>
                        <Input width='500px' name="serviceUrl" value="${serviceUrl || ''}"/>
                    </FsContent>
                </Fieldset>
                ${error ? `<Box color="red" marginBottom="20px">${error}</Box>`: '' }        
                <Button action="service">Setup</Button>
            </Box>
        `
}
