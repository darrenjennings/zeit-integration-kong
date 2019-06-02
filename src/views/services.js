// import setupView from './setup';
import rateLimiting from './plugins/rateLimiting';

export default async function servicesView (viewData) {
  const { payload } = viewData;
  const { serviceUrl } = payload.clientState
  
  let error = null;
  
  if (!serviceUrl) {
    error = 'Please enter service URL';
  } else {
    if (payload.action === 'service') {
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
          ${error ? `<Box color="red" marginBottom="20px">${error}</Box>` : ''}        
          <Button action="service">Setup</Button>
      </Box>
  `
}
