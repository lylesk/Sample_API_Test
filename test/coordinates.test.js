const { expect } = require('chai');
const get = require('request-promise');

const api_key = 'AIzaSyB2jLHR-7SjzOSCHT4FJsrC8FjnvmdpQA8';
const base_url = 'https://maps.googleapis.com/maps/api/geocode/json';
const address = '4444 Tigerland Ave, Baton Rouge, LA 70820';

// create and concatenate the urls
const construct_address_url = (address) => `${base_url}?address=${encodeURI(address)}&key=${api_key}`;
const construct_latlng_url = (lat,lng) => `${base_url}?latlng=${lat},${lng}&key=${api_key}`;

// TODO: add function to get a random address and plug it in

describe("GET /address", function() {
    it("returns a success response", function() {
        const address_url = construct_address_url(address);
        return get(address_url).then(res => {
            
            //verify a success response
            const parsedAddressResponse = JSON.parse(res);
            expect(parsedAddressResponse.status).to.equal('OK');

            //log the latitude and longitude
            console.log('Lat & Lng is: ' + parsedAddressResponse.results[0].geometry.location.lat + ', ' + parsedAddressResponse.results[0].geometry.location.lng);
            
            //set the lat and lng to pass into the next request
            const lat = parsedAddressResponse.results[0].geometry.location.lat;
            const lng = parsedAddressResponse.results[0].geometry.location.lng;
            const latlng_url = construct_latlng_url(lat,lng);
            
            //TODO split this out into multiple IT blocks
            return get(latlng_url).then(latlng_res => {
                const parsed_latlng_response = JSON.parse(latlng_res);
                
                // check for a success response and find the right object in the response
                expect(parsed_latlng_response.status).to.equal('OK');
                const corresponding_address = parsed_latlng_response.results.find(r => r.formatted_address.includes(address));
                console.log('Corresponding lat & lng is: ' + corresponding_address.geometry.location.lat + ', ' + corresponding_address.geometry.location.lng);

                //assert that the data types are correct
                expect(corresponding_address.geometry.location.lat).to.be.a('number');
                expect(corresponding_address.geometry.location.lng).to.be.a('number');
                expect(corresponding_address.geometry.location_type).to.be.a('string');
                
                //assert the lat and long in the obect is correct
                // Note that these coordinates are off even though it's the right address and I do not know why
                expect(corresponding_address.geometry.location.lat).to.eq(lat);
                expect(corresponding_address.geometry.location.lng).to.eq(lng);

                
            })
          })
    });
});