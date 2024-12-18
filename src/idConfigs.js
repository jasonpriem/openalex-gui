const idConfigs = {


    // multiple entities
    openalex: {
        namespace: "openalex",
        displayNamespace: "OpenAlex",
        provider: "OpenAlex",
        prefix: "https://openalex.org/",
        urlPattern: "https://openalex.org/",
        isUrl: true,
    },
    wikipedia: {
        namespace: "wikipedia",
        displayNamespace: "Wikipedia",
        provider: "Wikipedia",
        prefix: "https://en.wikipedia.org/wiki/",
        urlPattern: "https://en.wikipedia.org/wiki/",
        isUrl: true,
    },
    wikidata: {
        namespace: "wikidata",
        displayNamespace: "Wikidata",
        provider: "Wikidata",
        prefix: "https://www.wikidata.org/wiki/",
        urlPattern: "https://www.wikidata.org/wiki/",
        isUrl: true,
    },

    // works
    doi: {
        namespace: "doi",
        displayNamespace: "DOI",
        provider: "Crossref",
        prefix: "https://doi.org/",
        urlPattern: "https://search.crossref.org/?from_ui=yes&q=",
        isUrl: true,
        isCanonical: true,
    },
    pmid: {
        namespace: "pmid",
        displayNamespace: "PubMed",
        provider: "PubMed",
        prefix: "https://pubmed.ncbi.nlm.nih.gov/",
        urlPattern: "https://pubmed.ncbi.nlm.nih.gov/",
        isUrl: true,
    },
    pmcid: {
        namespace: "pmcid",
        displayNamespace: "PubMed Central",
        provider: "PubMed Central",
        prefix: "https://www.ncbi.nlm.nih.gov/pmc/articles/",
        urlPattern: "https://www.ncbi.nlm.nih.gov/pmc/articles/",
        isUrl: true,
    },

    // authors
    orcid: {
        namespace: "orcid",
        displayNamespace: "ORCiD",
        provider: "ORCiD",
        prefix: "https://orcid.org/",
        urlPattern: "https://orcid.org/",
        isUrl: true,
        isCanonical: true,
    },
    twitter: {
        namespace: "twitter",
        displayNamespace: "Twitter",
        provider: "Twitter",
        prefix: "https://twitter.com/",
        urlPattern: "https://twitter.com/",
        isUrl: true,
    },

    // sources
    issn_l: {
        namespace: "issn_l",
        displayNamespace: "ISSN-L",
        provider: "The ISSN International Centre",
        prefix: null,
        urlPattern: "https://portal.issn.org/resource/ISSN/",
        isCanonical: true,
        isUrl: false,
    },
    issn: {
        namespace: "issn",
        displayNamespace: "ISSN",
        provider: "The ISSN International Centre",
        prefix: null,
        urlPattern: "https://portal.issn.org/resource/ISSN/",
        isUrl: false,
        isArray: true,
    },

    // institutions
    ror: {
        namespace: "ror",
        displayNamespace: "ROR",
        provider: "The Research Organization Registry",
        prefix: "https://ror.org/",
        urlPattern: "https://ror.org/",
        isCanonical: true,
        isUrl: true,
    },

    // concepts
    // nothing to add here
}


export {
    idConfigs,
}