import KongClient from '../../lib/kong-client';
import pluginView from '../plugin';


console.log("rateLimiting")
export default async function rateLimiting(viewData) {
  const { payload, metadata, zeitClient } = viewData;
  const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition
    const docsURL = 'https://docs.konghq.com/hub/kong-inc/rate-limiting/'

  let error = null;
  let second = null;
  let minute = null;
  let hour = null;
  let day = null;

  if (payload.action === 'pluginConfigured') {
    if (!second && !minute && !hour && !day) {
      error = 'At least one limit must exist. Please enter a value for Second, Minute, Hour, or Day.';
    } else {
    //   console.log(kongAdminApiUrl)
    //   const kongClient = new KongClient({ url: kongAdminApiUrl, apiKey });
    //   viewData.kongClient = kongClient;
    //   const authChecked = await kongClient.fetchAndThrow('', {});
    //   if (authChecked) { // If the API key and URL are good, go to the next view
    //     console.log(authChecked)
    //     metadata.connectionInfo = { kongAdminApiUrl, apiKey };
    //     await zeitClient.setMetadata(metadata);
    //     return `
    //     <UL>
    //       ${Object.keys(authChecked.plugins.available_on_server).map(plugin => `<LI>${plugin}</LI>`)}
    //     </UL>
    //     `
        return pluginView(viewData)
    //     // return deploymentsView(viewData)
    //   }

      error = 'Please enter all the required fields';
    }
  }

  return `
        <Box>
            <Fieldset>
                <FsContent>
                    <H1>Rate Limiting</H1>
                    <FsSubtitle><Link href="${docsURL}" target="_blank">Kong Documentation</Link></FsSubtitle>
                    <P>Rate limit how many HTTP requests a developer can make in a given period of seconds, 
                        minutes, hours, days, months or years. If the underlying Service/Route (or deprecated API 
                        entity) has no authentication layer, the Client IP address will be used, otherwise the 
                        Consumer will be used if an authentication plugin has been configured.
                    </P>
                </FsContent>
                <FsContent>
                    <FsTitle>Seconds</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per second.</FsSubtitle>
                    <Input name="second" value="${second || ''}"/>
                </FsContent>
                    <FsContent>
                    <FsTitle>Minutes</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per minute.</FsSubtitle>
                    <Input name="minute" value="${minute || ''}"/>
                </FsContent>
                    <FsContent>
                    <FsTitle>Hours</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per hour.</FsSubtitle>
                    <Input name="hour" value="${hour || ''}"/>
                </FsContent>
                <FsContent>
                    <FsTitle>Days</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per day.</FsSubtitle>
                    <Input name="day" value="${day || ''}"/>
                </FsContent>
            </Fieldset>
            ${error ? `<Box color="red" marginBottom="20px">${error}</Box>`: '' }        
            <Button action="pluginConfigured">Setup</Button>
		</Box>
    `
}
