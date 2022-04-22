import sanityClient from "@sanity/client";




export const client = sanityClient({
    projectId:'psgfin17',
    dataset:'production',
    apiVersion:'v1',
    token:'skSD4pzA2enL5QL4kXgxOgrgH2S4O5OMKnDxXicekXQEQYbsVyVeSwTISdUmYChrwnlHx6MylFmI3EgwLG3WTrIg0P7PvZ086HDJfPN9ZOjT8zUldalSgfSFYcJJXt5DSF10NRXUojm22O1NeJsxHQEX9VyMjXeRf48Qi1zSUaixBWMlWx21'
})