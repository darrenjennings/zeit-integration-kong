// import setupView from './setup';
import pluginView from './plugin';

export default async function servicesView (viewData) {
  const { payload } = viewData;
  const { serviceUrl } = payload.clientState
  console.log("serviceUrl", serviceUrl)
  
  let error = null;
  
  if (payload.action === 'services') {
    if (!serviceUrl || serviceUrl === 'undefined' || serviceUrl === '') {
      error = 'Please enter service URL';
    } else {
      return pluginView(viewData)
    }
    error = 'Please enter service URL';
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
                <Button action="services">Setup</Button>
            </Box>
        `
}
