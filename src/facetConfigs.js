import {sortByKey, uniqueObjects, unravel} from "./util";
import {getEntityConfigs} from "@/entityConfigs";

const facetCategories = {
    works: [
        "popular",
        "author",
        "source",
        "funder",
        "institution",
        "open access",
        "citation",
        "other",
    ],
    authors: [
        "popular",
        "institution",
        "geo",
        "ids",
        "other",
    ],
    sources: [
        "popular",
        "open access",
        "other",
    ],
    publishers: [
        "popular",
        "other",
    ],
    institutions: [
        "popular",
        "geo",
        "other",
    ],
    concepts: [
        "popular",
        "other"
    ],
}

const facetCategoriesIcons = {
    popular: "mdi-star-outline",
    author: "mdi-account-outline",
    institution: "mdi-town-hall",
    // geo: "mdi-map-marker-outline",
    // funder: "mdi-cash-multiple",
    "source": "mdi-book-multiple-outline",
    // repository: "mdi-package-variant",
    // search: "mdi-magnify",
    "open access": "mdi-lock-open-outline",
    // apc: "mdi-cash",
    ids: "mdi-tag-outline",
    citation: "mdi-format-quote-close",
    other: "mdi-dots-horizontal",
}


const facetConfigs = function (entityType) {
    const ret = [


        // works:  WASPFIC.

        {
            key: "ids.openalex",
            entityType: "works",
            entityId: "works",
            displayName: "Work",
            isSingleWork: true,
            isId: true,
            type: "select",
            categories: ["ids"],
            category: "ids",
            actions: [""],
            icon: "mdi-file-document-outline",
            extractFn: (entity) => entity.id,
            isMultiple: false,
        },
        {
            key: "doi",
            entityType: "works",
            entityId: "works",
            displayName: "DOI",
            isSingleWork: true,
            isId: true,
            type: "select",
            categories: ["ids"],
            category: "ids",
            actions: [],
            icon: "mdi-file-document-outline",
            extractFn: (entity) => entity.doi,
            isMultiple: false,
        },
        {
            key: "concepts.id",
            entityType: "works",
            displayName: "concept",
            entityId: "concepts",
            type: "select",
            isManyOptions: true,
            categories: ["other",],
            category: "other",
            actions: [],
            actionsPopular: [],
            icon: "mdi-tag-outline",
            extractFn: (entity) => entity.concepts,
            isMultiple: true,
        },
        {
            key: "primary_topic.id",
            entityType: "works",
            displayName: "topic",
            entityId: "topics",
            type: "select",
            isManyOptions: true,
            categories: ["other",],
            category: "other",
            actions: ["filter", "group_by",],
            actionsPopular: ["filter", "group_by"],
            icon: "mdi-tag-outline",
            isMultiple: false,
            extractFn: (entity) => entity.primary_topic,
        },
        {
            key: "keywords.id",
            entityType: "works",
            displayName: "keyword",
            entityId: "keywords",
            type: "select",
            isManyOptions: true,
            categories: ["other",],
            category: "other",
            actions: ["filter", "group_by",],
            actionsPopular: ["filter", "group_by"],
            icon: "mdi-tag-outline",
            isMultiple: false,
            extractFn: (entity) => entity.keywords,
        },
        {
            key: "primary_topic.subfield.id",
            entityType: "works",
            displayName: "subfield",
            entityId: "subfields",
            type: "select",
            isManyOptions: true,
            categories: ["other",],
            category: "other",
            actions: ["filter", "group_by",],
            actionsPopular: [],
            icon: "mdi-tag-outline",
            isMultiple: false,
            extractFn: (entity) => entity.primary_topic.subfield,
        },
        {
            key: "primary_topic.field.id",
            entityType: "works",
            displayName: "field",
            entityId: "fields",
            type: "select",
            isManyOptions: true,
            categories: ["other",],
            category: "other",
            actions: ["filter", "group_by",],
            actionsPopular: [],
            icon: "mdi-tag-outline",
            isMultiple: false,
            extractFn: (entity) => entity.primary_topic.field,
        },
        {
            key: "primary_topic.domain.id",
            entityType: "works",
            displayName: "domain",
            entityId: "domains",
            type: "select",
            isManyOptions: true,
            categories: ["other",],
            category: "other",
            actions: ["filter", "group_by",],
            actionsPopular: [],
            icon: "mdi-tag-outline",
            isMultiple: false,
            extractFn: (entity) => entity.primary_topic.domain,
        },
        {
            key: "grants.funder",
            entityType: "works",
            displayName: "funder",
            entityId: "funders",
            type: "select",
            isManyOptions: true,
            categories: ["other"],
            category: "other",
            actions: ["filter", "group_by",],
            icon: "mdi-cash-multiple",
            extractFn: (entity) => entity.grants.map(grant => {
                return {
                    id: grant.funder,
                    display_name: grant.funder_display_name,
                }
            }),
            displayNullAs: "Unknown",
            isMultiple: true,
        },

        {
            key: "grants.award_id",
            entityType: "works",
            displayName: "grant ID",
            type: "search",
            isManyOptions: true,
            categories: ["funder"],
            category: "other",
            actions: [],
            icon: "mdi-cash-multiple",
            extractFn: (entity) => entity.grants.map(grant => grant.award_id),
            isMultiple: true,
        },


        {
            key: "authorships.institutions.lineage",
            entityType: "works",
            displayName: "institution",
            entityId: "institutions",
            type: "select",
            isManyOptions: true,
            categories: ["institution", "popular"],
            category: "institution",
            actions: ["filter", "group_by",],
            actionsPopular: ["filter", "group_by",],
            icon: "mdi-town-hall",
            extractFn: (entity) => {
                const nested = entity.authorships.map(authorship => {
                    return authorship.institutions
                })
                return uniqueObjects(nested.flat())
            },
            isMultiple: true,
        },

        {
            key: "authorships.institutions.ror",
            entityType: "works",
            entityId: "institutions",
            displayName: "ROR ID",
            isId: true,
            type: "entity",
            categories: ["ids"],
            category: "ids",
            actions: [],
            icon: "mdi-town-hall",
            extractFn: (entity) => {
                const nested = entity.authorships.map(authorship => {
                    return authorship.institutions.map(insti => insti.ror)
                })
                return nested.flat()
            },
            isMultiple: true,
        },

        {
            key: "authorships.author.id",
            entityType: "works",
            displayName: "author",
            entityId: "authors",
            type: "select",
            isManyOptions: true,
            categories: ["author", "popular"],
            category: "author",
            actions: ["filter", "group_by",],
            actionsPopular: ["filter", "group_by",],
            icon: "mdi-account-outline",
            extractFn: (entity) => {
                return entity.authorships.map(authorship => {
                    return authorship.author
                })
            },
            isMultiple: true,
        },


        {
            key: "authorships.author.orcid",
            entityType: "works",
            entityId: "authors",
            displayName: "ORCID",
            isId: true,
            type: "entity",
            categories: ["ids"],
            category: "ids",
            actions: [],
            icon: "mdi-account-outline",
            extractFn: (entity) => {
                return entity.authorships.map(authorship => {
                    return authorship.author.orcid
                })
            },
            isMultiple: true,
        },


        // works: search

        {
            key: "default.search",
            entityType: "works",
            displayName: "fulltext",
            type: "search",
            categories: ["other", "popular"],
            actions: ["filter",],
            actionsPopular: ["filter",],
            category: "other",
            icon: "mdi-magnify",
            isMultiple: false,
        },
        {
            key: "title_and_abstract.search",
            entityType: "works",
            displayName: "title & abstract",
            type: "search",
            categories: ["other",],
            actions: ["filter",],
            actionsPopular: [],
            category: "other",
            icon: "mdi-magnify",
            isMultiple: false,
        },

        {
            key: "display_name.search",
            entityType: "works",
            displayName: "title",
            actions: ["filter",],
            actionsPopular: [],
            type: "search",
            categories: ["search"],
            icon: "mdi-magnify",
        },
        {
            key: "raw_affiliation_strings.search",
            entityType: "works",
            displayName: "raw affiliation string",
            type: "search",
            categories: ["other",],
            actions: ["filter",],
            actionsPopular: ["",],
            category: "other",
            icon: "mdi-magnify",
            isMultiple: false,
        },
        {
            key: "doi_starts_with",
            entityType: "works",
            displayName: "DOI prefix",
            type: "search",
            categories: ["other",],
            actions: ["filter",],
            actionsPopular: [],
            category: "other",
            icon: "mdi-magnify",
            isMultiple: false,
            verb: "starts with",
        },

        // {
        //     key: "abstract.search",
        //     entityType: "works",
        //     displayName: "Abstract search",
        //     type: "search",
        //     categories: ["search"],
        //             //     icon: "mdi-magnify",
        // },

        /// this is a weird one, still working it into the schema
        {
            key: "display_name",
            isColumnMandatory: true,
            entityType: "works",
            displayName: "title",
            type: "search",
            categories: ["search"],
            actions: ["sort", "column",],
            actionsPopular: ["sort", "column",],
            category: "other",
            icon: "mdi-file-document-outline",
            extractFn: (entity) => entity.display_name,
            isMultiple: false,
        },

        {
            key: "has_abstract",
            entityType: "works",
            displayName: "Abstract available",
            type: "boolean",
            actions: ["filter"],
            categories: ["search"],
            icon: "mdi-file-document-outline",
        },
        // {
        //     key: "has_ngrams",
        //     entityType: "works",
        //     displayName: "Indexing status (fulltext)",
        //     booleanValues: ["fulltext NOT indexed", "fulltext indexed"],
        //     type: "boolean",
        //     categories: ["search"],
        //     icon: "mdi-file-document-outline",
        // },


        // works: authors

        {
            key: "authors_count",
            entityType: "works",
            displayName: "authors count",
            type: "range",
            sortByValue: true,
            categories: ["author"],
            category: "author",
            actions: ["filter", "sort", "column",],
            icon: "mdi-account-outline",
            extractFn: (entity) => entity.authors_count,
            isMultiple: false,
        },
        {
            key: "corresponding_author_ids",
            entityType: "works",
            entityId: "authors",
            displayName: "corresponding author",
            type: "select",
            isManyOptions: true,
            categories: ["author"],
            category: "author",
            actions: ["filter", "group_by",],
            icon: "mdi-email-outline",
            isMultiple: true,
        },


        // works: open access
        {
            key: "open_access.is_oa",
            entityType: "works",
            displayName: "open access",
            type: "boolean",
            booleanValues: ["NOT Open Access", "Open Access"],
            categories: ["popular", "open access"],
            actions: ["filter", "column", "group_by",],
            actionsPopular: ["filter", "column", "group_by",],
            category: "open access",
            icon: "mdi-lock-open-outline",
            isMultiple: false,
        },

        {
            key: "best_oa_location.license",
            entityType: "works",
            entityId: "licenses",
            displayName: "license",
            type: "select",
            categories: ["open access"],
            // actions: [],
            actions: ["filter", "column", "group_by"],
            category: "open access",
            icon: "mdi-lock-open-outline",
            displayNullAs: "All rights reserved",
            isMultiple: false,
        },


        // works but with workarounds because entity endpoints don't exist
        {
            key: "open_access.oa_status",
            entityType: "works",
            entityId: "oa-statuses",
            displayName: "Open Access status",
            type: "select",
            categories: ["open access"],
            actions: ["filter", "column", "group_by",],
            category: "open access",
            icon: "mdi-lock-open-outline",
            isMultiple: false,
            extractFn: (entity) => entity.open_access.oa_status,
        },
        // {
        //     key: "best_oa_location.version",
        //     entityType: "works",
        //     displayName: "Open Access version",
        //     type: "select",
        //     categories: ["open access"],
        //     icon: "mdi-lock-open-outline",
        // },
        {
            key: "best_oa_location.is_accepted",
            entityType: "works",
            displayName: "open access accepted",
            type: "boolean",
            booleanValues: ["NOT Open Access", "Open Access"],
            categories: ["open access"],
            actions: ["filter", "column", "group_by",],
            category: "open access",
            icon: "mdi-lock-open-outline",
            isMultiple: false,
        },
        {
            key: "best_oa_location.is_published",
            entityType: "works",
            displayName: "open access published",
            type: "boolean",
            booleanValues: ["NOT Open Access", "Open Access"],
            categories: ["open access"],
            actions: ["filter", "column", "group_by",],
            category: "open access",
            icon: "mdi-lock-open-outline",
            isMultiple: false,
        },


        // works: APC
        // {
        //     key: "apc_list.value_usd",
        //     entityType: "works",
        //     displayName: "APC list price",
        //     type: "range",
        //     sortByValue: true,
        //             //     categories: ["apc"],
        //             //     icon: "mdi-cash"
        // },


        //
        {
            key: "apc_paid.value_usd",
            entityType: "works",
            displayName: "APC paid (est)",
            type: "range",
            sortByValue: true,
            categories: ["apc"],
            actions: ["filter",],
            icon: "mdi-cash",
            extractFn: (entity) => entity.apc_paid.value_usd,
        },


        // {
        //     key: "apc_paid.provenance",
        //     entityType: "works",
        //     displayName: "APC paid: provenance",
        //     type: "select",
        //     categories: ["apc"],
        //             //     icon: "mdi-cash"
        // },


        // works: institutions:
        {
            key: "authorships.countries",
            entityType: "works",
            entityId: "countries",
            displayName: "Country",
            type: "select",
            isManyOptions: true,
            isCountry: true,
            categories: ["geo", "institution"],
            actions: ["filter", "column", "group_by",],
            actionsPopular: ["group_by",],
            category: "institution",
            icon: "mdi-earth",
            isMultiple: true,
        },
        {
            key: "countries_distinct_count",
            entityType: "works",
            displayName: "countries count",
            type: "range",
            sortByValue: true,
            examples: ["1", "2-", "2-10"],
            categories: ["geo"],
            actions: ["filter", "sort", "column",],
            category: "institution",
            icon: "mdi-earth",
            isMultiple: false,
        },
        {
            key: "institutions_distinct_count",
            entityType: "works",
            displayName: "institutions count",
            type: "range",
            sortByValue: true,
            examples: ["1", "2-", "2-10"],
            categories: ["geo"],
            actions: ["filter", "sort", "column",],
            category: "institution",
            icon: "mdi-earth",
            isMultiple: false,
        },
        {
            key: "authorships.institutions.continent",
            entityType: "works",
            entityId: "continents",
            displayName: "Continent",
            type: "select",
            categories: ["geo", "institution"],
            actions: ["filter", "column", "group_by",],
            actionsPopular: [],
            icon: "mdi-earth",
        },
        {
            key: "institutions.is_global_south",
            entityType: "works",
            displayName: "from Global South",
            type: "boolean",
            actions: ["filter", "column", "group_by",],
            categories: ["geo", "institution"],
            category: "institution",
            booleanValues: ["Global North", "Global South"],
            icon: "mdi-earth",
            // icon: "mdi-town-hall",
            isMultiple: true,
        },
        {
            key: "authorships.institutions.type",
            entityType: "works",
            displayName: "institution type",
            category: "institution",
            type: "select",
            categories: ["institution"],
            actions: ["filter", "group_by",],
            icon: "mdi-town-hall",
            isMultiple: true,
        },
        {
            key: "corresponding_institution_ids",
            entityType: "works",
            entityId: "institutions",
            displayName: "corresponding institution",
            category: "institution",
            type: "select",
            isManyOptions: true,
            categories: ["institution"],
            actions: ["filter", "group_by",],
            icon: "mdi-email-outline",
            isMultiple: true,
        },


        // works: primary source

        {
            key: "primary_location.source.id",
            entityType: "works",
            displayName: "source",
            entityId: "sources",
            type: "select",
            isManyOptions: true,
            categories: ["source"],
            category: "source",
            actions: ["filter", "group_by",],
            icon: "mdi-book-open-outline",
            extractFn: (entity) => entity.primary_location.source,
            isMultiple: false,
        },

        {
            key: "primary_location.source.issn",
            entityType: "works",
            entityId: "sources",
            displayName: "ISSN",
            isId: true,
            type: "entity",
            categories: ["ids"],
            category: "ids",
            actions: [],
            icon: "mdi-book-open-outline",
            isMultiple: false,
        },
        {
            key: "primary_location.source.type",
            entityType: "works",
            entityId: "sources",
            displayName: "source type",
            type: "select",
            categories: ["source"],
            category: "source",
            actions: ["filter", "column", "group_by",],
            icon: "mdi-book-open-outline",
            isMultiple: false,
        },
        {
            key: "primary_location.source.is_in_doaj",
            entityType: "works",
            displayName: "indexed by DOAJ",
            type: "boolean",
            booleanValues: ["Not in DOAJ", "In DOAJ"],
            categories: ["source"],
            category: "source",
            actions: ["filter", "group_by",],
            icon: "mdi-book-open-outline",
            isMultiple: false,
        },
        {
            key: "primary_location.source.is_core",
            entityType: "works",
            displayName: "CWTS Core source",
            type: "boolean",
            booleanValues: ["Not CWTS Core source", "CWTS Core source"],
            categories: ["source"],
            category: "source",
            actions: ["filter", "group_by",],
            icon: "mdi-book-open-outline",
            isMultiple: false,
        },
        {
            key: "primary_location.source.is_oa",
            entityType: "works",
            displayName: "in OA source",
            type: "boolean",
            booleanValues: ["Not Open Access", "Open Access"],
            categories: ["source"],
            category: "source",
            actions: ["filter", "column", "group_by",],
            icon: "mdi-book-open-outline",
            isMultiple: false,
        },

        {
            key: "primary_location.source.publisher_lineage",
            entityType: "works",
            entityId: "publishers",
            displayName: "publisher",
            // entityId: "publishers",
            type: "select",
            isManyOptions: true,
            categories: ["source"],
            category: "source",
            actions: ["filter", "group_by",],
            icon: "mdi-domain",
            isMultiple: false,
        },


        // works: repository

        // {
        //     key: "repository",
        //     entityType: "works",
        //     displayName: "repository",
        //     entityId: "sources",
        //     type: "select",
        //     isManyOptions: true,
        //     categories: ["source"],
        //     category: "source",
        //     actions: ["filter", "group_by",],
        //     icon: "mdi-book-open-outline",
        //     isMultiple: true,
        // },
        {
            key: "open_access.any_repository_has_fulltext",
            entityType: "works",
            displayName: "has repository fulltext",
            type: "boolean",
            booleanValues: ["Not in any repository", "In a repository"],
            categories: ["source"],
            category: "source",
            actions: ["filter", "column", "group_by",],
            icon: "mdi-tag-outline",
            isMultiple: true,
        },


        // works: intrinsic


        {
            key: "type",
            entityType: "works",
            entityId: "types",
            displayName: "type",
            type: "select",
            categories: ["popular", "other"],
            category: "other",
            actions: ["filter", "column", "group_by",],
            actionsPopular: ["filter", "column", "group_by",],
            icon: "mdi-shape-outline",
            extractFn: (entity) => entity.type,
            isMultiple: false,
        },
        {
            key: "abstract",
            entityType: "works",
            displayName: "Abstract",
            type: "search",
            categories: ["search"],
            actions: [], // just for display
            icon: "mdi-text",
            isMultiple: false,
            extractFn: (entity) => {
                if (!entity?.open_access?.is_oa) return
                return unravel(entity.abstract_inverted_index)
            },
        },
        {
            key: "publication_year",
            entityType: "works",
            displayName: "year",
            isDate: true,
            type: "range",
            sortByValue: true,
            examples: ["1999", "1999-", "1999-2020"],
            categories: ["popular", "other"],
            category: "other",
            actions: ["filter", "sort", "column", "group_by",],
            actionsPopular: ["filter", "sort", "column", "group_by",],
            icon: "mdi-calendar-range",
            extractFn: (entity) => entity.publication_year,
            isMultiple: false,
        },
        {
            key: "apc_sum",
            entityType: "works",
            displayName: "APC sum",
            type: "sum",
            categories: ["other"],
            category: "other",
            actions: ["group_by",],
            actionsPopular: ["group_by",],
            icon: "mdi-cash",
            isMultiple: false,
        },
        {
            key: "cited_by_count_sum",
            entityType: "works",
            displayName: "Citations sum",
            type: "sum",
            categories: ["other"],
            category: "other",
            actions: ["group_by",],
            actionsPopular: ["group_by",],
            icon: "mdi-format-quote-close",
            isMultiple: false,
        },
        {
            key: "publication_date",
            entityType: "works",
            displayName: "date",
            isDate: true,
            type: "range",
            categories: ["other"],
            actions: ["sort",],
            sortByValue: true,
            category: "other",
            examples: ["1999", "1999-", "1999-2020"],
            icon: "mdi-calendar-range",
            isMultiple: false,
        },
        {
            key: "has_doi",
            entityType: "works",
            displayName: "indexed by Crossref",
            type: "boolean",
            booleanValues: ["Has a DOI", "No DOI"],
            categories: ["ids"],
            category: "ids",
            actions: ["filter", "group_by",],
            icon: "mdi-tag-outline",
            isMultiple: false,
        },
        {
            key: "mag_only",
            entityType: "works",
            displayName: "indexed by MAG only",
            type: "boolean",
            booleanValues: ["indexed by MAG only", "indexed beyond MAG"],
            categories: ["ids"],
            category: "ids",
            actions: ["filter", "group_by",],
            icon: "mdi-tag-outline",
            isMultiple: false,
        },
        {
            key: "has_orcid",
            entityType: "works",
            displayName: "indexed by ORCID",
            type: "boolean",
            booleanValues: ["No ORCID", "At least one ORCID",],
            categories: ["ids"],
            actions: ["filter", "group_by",],
            icon: "mdi-tag-outline",
            isMultiple: true,
        },
        {
            key: "has_pmid",
            entityType: "works",
            displayName: "indexed by PubMed",
            type: "boolean",
            categories: ["ids"],
            category: "ids",
            actions: ["filter", "group_by",],
            icon: "mdi-tag-outline",
            booleanValues: ["No PubMed ID", "Has PubMed ID"],
            isMultiple: false,
        },
        // {
        //     key: "has_pmcid",
        //     entityType: "works",
        //     displayName: "Indexed by PubMed Central",
        //     type: "boolean",
        //     categories: ["ids"],
        //     actions: ["filter",  "column", "group_by",],
        //     icon: "mdi-tag-outline",
        //     booleanValues: ["No PMC ID", "Has PMC ID"],
        // },
        {
            key: "is_retracted",
            entityType: "works",
            displayName: "retracted",
            type: "boolean",
            booleanValues: ["Isn't retracted", "Is retracted"],
            categories: ["other"],
            category: "other",
            actions: ["filter", "column", "group_by",],
            icon: "mdi-close-octagon",
            isMultiple: false,
        },
        {
            key: "language",
            entityId: "languages",
            entityType: "works",
            displayName: "language",
            type: "select",
            displayNullAs: "Unknown",
            categories: ["other"],
            category: "other",
            actions: ["filter", "column", "group_by",],
            actionsPopular: ["column", "group_by"],
            icon: "mdi-translate",
            isMultiple: false,
        },
        {
            key: "sustainable_development_goals.id",
            entityId: "sdgs",
            entityType: "works",
            displayName: "Sustainable Development Goal",
            type: "select",
            displayNullAs: "Unknown",
            categories: ["other", "popular"],
            category: "other",
            actions: ["filter", "group_by",],
            icon: "mdi-sprout-outline",
            isMultiple: true,
            extractFn: (entity) => entity.sustainable_development_goals
        },


        {
            key: "cited_by_count",
            entityType: "works",
            displayName: "citation count",
            type: "range",
            sortByValue: true,
            categories: ["citation"],
            category: "citation",
            actions: ["filter", "sort", "column",],
            actionsPopular: ["sort", "column",],
            icon: "mdi-format-quote-close",
            isMultiple: false,
        },
        {
            key: "referenced_works_count",
            entityType: "works",
            displayName: "references count",
            type: "range",
            sortByValue: true,
            categories: ["citation"],
            category: "citation",
            actions: ["filter", "column",],
            actionsPopular: [],
            icon: "mdi-format-quote-close",
            isMultiple: false,
        },
        {
            key: "cited_by_percentile_year.min",
            entityType: "works",
            displayName: "Citation percentile (year)",
            type: "range",
            sortByValue: true,
            categories: ["citation"],
            category: "citation",
            actions: ["filter", "sort", "column",],
            actionsPopular: ["sort", "column",],
            icon: "mdi-format-quote-close",
            isMultiple: false,
        },
        {
            key: "cited_by",
            entityType: "works",
            entityId: "works",
            displayName: "cited by",
            type: "select", // used to be "entity"
            categories: ["citation"],
            category: "citation",
            actions: [],
            icon: "mdi-format-quote-close",
            isMultiple: true,
            isDisplayedAsCount: true,
            extractFn: (entity) => entity.cited_by_count,
        },
        {
            key: "cites",
            entityType: "works",
            entityId: "works",
            displayName: "cites",
            type: "select", // used to be "entity"
            categories: ["citation"],
            category: "citation",
            actions: [],
            icon: "mdi-format-quote-close",
            isMultiple: true,
            isDisplayedAsCount: true,
            extractFn: (entity) => entity.referenced_works.length,
        },
        {
            key: "related_to",
            entityType: "works",
            entityId: "works",
            displayName: "related to",
            type: "select", // used to be "entity"
            categories: ["other"],
            category: "other",
            actions: ["filter",],
            isHidden: true,
            icon: "mdi-book-open-outline",
            isMultiple: true,
            isDisplayedAsCount: true,
            extractFn: (entity) => entity.related_works.length,
        },


        // authors
        {
            key: "ids.openalex",
            entityType: "authors",
            entityId: "authors",
            displayName: "author",
            type: "select",
            actions: [],
            actionsPopular: [],
            isId: true,
            categories: ["other"],
            icon: "mdi-account-outline",
        },
        {
            key: "ids.orcid",
            entityType: "authors",
            entityId: "authors",
            displayName: "ORCID",
            isId: true,
            type: "select",
            categories: ["other"],
            icon: "mdi-account-outline",
            extractFn: (e) => e.ids.orcid
        },
        {
            key: "default.search",
            entityType: "authors",
            entityId: "authors",
            displayName: "name",
            type: "search",
            categories: ["search"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-magnify",
        },

        {
            key: "display_name",
            isColumnMandatory: true,
            entityType: "authors",
            displayName: "name",
            type: "search",
            categories: ["search"],
            actions: ["sort", "column",],
            actionsPopular: ["sort", "column",],
            category: "other",
            icon: "mdi-account-outline",
            extractFn: (entity) => entity.display_name,
            isMultiple: false,
        },
        {
            key: "affiliations.institution.id",
            entityType: "authors",
            displayName: "Past institutions",
            entityId: "institutions",
            type: "select",
            isManyOptions: true,
            categories: ["institution"],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter"],
            icon: "mdi-town-hall",
            extractFn: (entity) => {
                return entity.affiliations.map(affil => {
                    return affil.institution
                })
            },
        },
        {
            key: "affiliations.institution.type",
            entityType: "authors",
            entityId: "institution-types",
            displayName: "Past institutions type",
            type: "select",
            categories: ["institution"],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter",],
            icon: "mdi-shape-outline",
        },
        {
            key: "last_known_institutions.id",
            entityType: "authors",
            displayName: "institution",
            entityId: "institutions",
            type: "select",
            isManyOptions: true,
            categories: ["institution"],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter", "group_by"],
            icon: "mdi-town-hall",
            extractFn: (entity) => entity.last_known_institutions,
        },
        {
            key: "last_known_institutions.country_code",
            entityType: "authors",
            entityId: "countries",
            displayName: "institution country",
            type: "select",
            isCountry: true,
            categories: ["geo"],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter", "group_by"],
            icon: "mdi-earth",
            extractFn: (entity) => { // i think this is wrong, but unused?
                return entity.last_known_institutions.map(insti => {
                    return insti.institution
                })
            },
        },
        {
            key: "last_known_institutions.type",
            entityType: "authors",
            entityId: "institution-types",
            displayName: "Institution type",
            type: "select",
            categories: ["institution"],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter",],
            icon: "mdi-shape-outline",
        },
        {
            key: "has_orcid",
            entityType: "authors",
            entityId: "authors",
            displayName: "Has an ORCID",
            type: "boolean",
            booleanValues: ["No ORCID", "Has ORCID"],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter", "group_by"],
            categories: ["ids"],
            icon: "mdi-tag-outline",
        },
        {
            key: "display_name_alternatives",
            entityType: "authors",
            entityId: "authors",
            displayName: "alternate names",
            type: "select",
            actions: [],
            actionsPopular: [],
            icon: "mdi-town-hall",
            isMultiple: true,
            extractFn: (entity) => entity.display_name_alternatives,
        },

        // authors: summary_stats
        {
            key: "summary_stats.h_index",
            entityType: "authors",
            entityId: "authors",
            displayName: "h-index",
            type: "range",
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-chart-line",
            isMultiple: true,
            extractFn: (entity) => entity.summary_stats.h_index,
        },
        {
            key: "summary_stats.i10_index",
            entityType: "authors",
            entityId: "authors",
            displayName: "i10-index",
            type: "range",
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-chart-line",
            isMultiple: true,
            extractFn: (entity) => entity.summary_stats.i10_index,
        },


        // sources
        {
            key: "ids.openalex",
            entityType: "sources",
            entityId: "sources",
            displayName: "Source",
            isId: true,
            type: "entity",
            categories: ["other"],
            icon: "mdi-book-open-outline",
        },
        {
            key: "default.search",
            entityType: "sources",
            entityId: "sources",
            displayName: "name",
            type: "search",
            categories: ["search"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-magnify",
        },
        {
            key: "ids.issn",
            entityType: "sources",
            entityId: "sources",
            displayName: "ISSNs",
            isId: true,
            type: "entity",
            categories: ["other"],
            icon: "mdi-book-open-outline",
            extractFn: (e) => e.issn
        },
        {
            key: "display_name.search",
            entityType: "sources",
            displayName: "Title search",
            type: "search",
            categories: ["search"],
            icon: "mdi-magnify",
        },


        {
            key: "display_name",
            isColumnMandatory: true,
            entityType: "sources",
            displayName: "name",
            type: "search",
            categories: ["search"],
            actions: ["sort", "column",],
            actionsPopular: ["sort", "column",],
            category: "other",
            icon: "mdi-account-outline",
            extractFn: (entity) => entity.display_name,
            isMultiple: false,
        },
        {
            key: "publisher",
            entityType: "sources",
            entityId: "publishers",
            displayName: "Publisher",
            type: "select",
            isManyOptions: true,
            categories: ["popular"],
            actions: [],
            actionsPopular: [],
            icon: "mdi-domain",
            extractFn: (e) => {
                if (e.type !== "journal") return
                return {
                    id: e.host_organization,
                    display_name: e.host_organization_name,
                }
            },
        },
        {
            key: "type",
            entityType: "sources",
            entityId: "source-types",
            displayName: "Source type",
            type: "select",
            categories: ["popular"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-shape-outline",
            extractFn: (e) => e.type,
        },
        {
            key: "apc_usd",
            entityType: "sources",
            displayName: "Article Processing Charge",
            type: "range",
            categories: ["popular"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-cash",
            extractFn: (e) => {
                if (!e.apc_usd) return
                return "$" + e.apc_usd.toLocaleString()
            },
        },
        {
            key: "is_oa",
            entityType: "sources",
            displayName: "Fully open access",
            type: "boolean",
            categories: ["open access"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-lock-open-outline",
            extractFn: (e) => e.is_oa,
        },
        {
            key: "is_in_doaj",
            entityType: "sources",
            displayName: "In DOAJ",
            type: "boolean",
            categories: ["open access"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-lock-open-outline",
            extractFn: (entity) => entity.is_in_doaj,
        },
        {
            key: "is_core",
            entityType: "sources",
            displayName: "CWTS Core source",
            type: "boolean",
            categories: [],
            actions: ["filter", "group_by"],
            actionsPopular: ["filter"],
            icon: "mdi-book-open-outline",
            extractFn: (entity) => entity.is_core,
        },
        {
            key: "alternate_titles",
            entityType: "sources",
            displayName: "alternate names",
            type: "select",
            actions: [],
            actionsPopular: [],
            icon: "mdi-book-open-outline",
            isMultiple: true,
            extractFn: (entity) => entity.alternate_titles,
        },

        // sources: summary_stats
        {
            key: "summary_stats.2yr_mean_citedness",
            entityType: "sources",
            displayName: "2yr mean citedness",
            type: "range",
            actions: ["filter", "sort"],
            actionsPopular: ["filter", "sort"],
            icon: "mdi-chart-line",
            isMultiple: true,
            extractFn: (entity) => entity.summary_stats["2yr_mean_citedness"],
        },
        {
            key: "summary_stats.h_index",
            entityType: "sources",
            displayName: "h-index",
            type: "range",
            actions: ["filter"],
            actionsPopular: [],
            icon: "mdi-chart-line",
            isMultiple: true,
            extractFn: (entity) => entity.summary_stats.h_index,
        },
        {
            key: "summary_stats.i10_index",
            entityType: "sources",
            displayName: "i10-index",
            type: "range",
            actions: ["filter"],
            actionsPopular: [],
            icon: "mdi-chart-line",
            isMultiple: true,
            extractFn: (entity) => entity.summary_stats.i10_index,
        },


        // publishers
        {
            key: "ids.openalex",
            entityType: "publishers",
            entityId: "publishers",
            displayName: "Publisher",
            isId: true,
            type: "entity",
            categories: ["other"],
            icon: "mdi-domain",
        },
        {
            key: "display_name.search",
            entityType: "publishers",
            displayName: "Name search",
            type: "search",
            categories: ["search"],
            icon: "mdi-magnify",
        },


        // funders
        {
            key: "ids.openalex",
            entityType: "funders",
            entityId: "funders",
            displayName: "Funder",
            isId: true,
            type: "entity",
            categories: ["other"],
            icon: "mdi-cash-multiple",
        },
        {
            key: "display_name.search",
            entityType: "funders",
            displayName: "Name search",
            type: "search",
            categories: ["search"],
            icon: "mdi-magnify",
        },


        // institutions
        {
            key: "ids.openalex",
            entityType: "institutions",
            entityId: "institutions",
            displayName: "Institution",
            isId: true,
            type: "entity",
            categories: ["other"],
            icon: "mdi-town-hall",
        },
        {
            key: "default.search",
            entityType: "institutions",
            entityId: "institutions",
            displayName: "name",
            type: "search",
            categories: ["search"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-magnify",
        },
        {
            key: "display_name",
            isColumnMandatory: true,
            entityType: "institutions",
            displayName: "name",
            type: "search",
            categories: ["search"],
            actions: ["sort", "column",],
            actionsPopular: ["sort", "column",],
            category: "other",
            icon: "mdi-account-outline",
            extractFn: (entity) => entity.display_name,
            isMultiple: false,
        },
        {
            key: "ids.ror",
            entityType: "institutions",
            entityId: "institutions",
            displayName: "ROR",
            isId: true,
            type: "select",
            categories: ["other"],
            icon: "mdi-town-hall",
            extractFn: (e) => e.ids.ror,
        },
        {
            key: "display_name.search",
            entityType: "institutions",
            displayName: "Name search",
            type: "search",
            categories: ["search"],
            icon: "mdi-magnify",
        },
        {
            key: "country_code",
            entityType: "institutions",
            entityId: "countries",
            displayName: "Country",
            type: "select",
            isManyOptions: true,
            isCountry: true,
            categories: ["geo"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-earth"
        },
        {
            key: "type",
            entityType: "institutions",
            entityId: "institution-types",
            displayName: "Institution type",
            type: "select",
            categories: ["popular"],
            actions: ["filter"],
            actionsPopular: ["filter"],
            icon: "mdi-shape-outline"
        },
        {
            key: "x_concepts.id",
            entityType: "institutions",
            displayName: "Concepts",
            entityId: "concepts",
            type: "select",
            isManyOptions: true,
            categories: ["other"],
            icon: "mdi-tag-outline",
        },
        {
            key: "display_name_alternatives",
            entityType: "institutions",
            displayName: "alternate names",
            type: "select",
            actions: [],
            actionsPopular: [],
            icon: "mdi-town-hall",
            isMultiple: true,
            extractFn: (entity) => entity.display_name_alternatives,
        },
        {
            key: "parent_institutions",
            entityType: "institutions",
            displayName: "parent institutions",
            type: "select",
            actions: [],
            actionsPopular: [],
            icon: "mdi-town-hall",
            isMultiple: true,
            extractFn: (entity) => entity.associated_institutions.filter(i => {
                return i.relationship === "parent"
            }),
        },
        {
            key: "child_institutions",
            entityType: "institutions",
            displayName: "child institutions",
            type: "select",
            actions: [],
            actionsPopular: [],
            icon: "mdi-town-hall",
            isMultiple: true,
            extractFn: (entity) => entity.associated_institutions.filter(i => {
                return i.relationship === "child"
            }),
        },
        {
            key: "related_institutions",
            entityType: "institutions",
            displayName: "related institutions",
            type: "select",
            actions: [],
            actionsPopular: [],
            icon: "mdi-town-hall",
            isMultiple: true,
            extractFn: (entity) => entity.associated_institutions.filter(i => {
                return i.relationship === "related"
            }),
        },


        // institutions: summary_stats
        // none for now.


        // concepts
        {
            key: "ids.openalex",
            entityType: "concepts",
            entityId: "concepts",
            displayName: "Concept",
            isId: true,
            type: "entity",
            categories: ["other"],
            icon: "mdi-tag-outline",
        },
        {
            key: "display_name.search",
            entityType: "concepts",
            displayName: "Name search",
            type: "search",
            categories: ["search"],
            icon: "mdi-magnify",
        },
        {
            key: "level",
            entityType: "concepts",
            displayName: "Level",
            maxPotentialFiltersToShow: 10,
            type: "select",
            categories: ["popular"],
            icon: "mdi-tag-outline"
        },


        // topics
        {
            key: "description",
            entityType: "topics",
            entityId: "topics",
            displayName: "description",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.description,
        },
        {
            key: "siblings",
            entityType: "topics",
            entityId: "topics",
            displayName: "related topics (siblings)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.siblings,
        },
        {
            key: "subfield",
            entityType: "topics",
            entityId: "topics",
            displayName: "subfield (parent)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.subfield,
        },
        {
            key: "field",
            entityType: "topics",
            entityId: "topics",
            displayName: "field",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.field,
        },
        {
            key: "domain",
            entityType: "topics",
            entityId: "topics",
            displayName: "domain",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.domain,
        },


        // subfields
        {
            key: "description",
            entityType: "subfields",
            entityId: "subfields",
            displayName: "description",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.description,
        },
        {
            key: "display_name_alternatives",
            entityType: "subfields",
            entityId: "subfields",
            displayName: "alternate names",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.display_name_alternatives,
        },
        {
            key: "topics",
            entityType: "subfields",
            entityId: "subfields",
            displayName: "topics (children)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.topics,
        },
        {
            key: "siblings",
            entityType: "subfields",
            entityId: "subfields",
            displayName: "related subfields (siblings)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.siblings,
        },
        {
            key: "field",
            entityType: "subfields",
            entityId: "subfields",
            displayName: "field (parent)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.field,
        },
        {
            key: "domain",
            entityType: "subfields",
            entityId: "subfields",
            displayName: "domain",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.domain,
        },


        // fields
        {
            key: "description",
            entityType: "fields",
            entityId: "fields",
            displayName: "description",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.description,
        },
        {
            key: "display_name_alternatives",
            entityType: "fields",
            entityId: "fields",
            displayName: "alternate names",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.display_name_alternatives,
        },
        {
            key: "siblings",
            entityType: "fields",
            entityId: "fields",
            displayName: "related fields (siblings)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.siblings,
        },
        {
            key: "subfields",
            entityType: "fields",
            entityId: "fields",
            displayName: "subfields (children)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.subfields,
        },
        {
            key: "domain",
            entityType: "fields",
            entityId: "fields",
            displayName: "domain (parent)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.domain,
        },


        // domains
        {
            key: "description",
            entityType: "domains",
            entityId: "domains",
            displayName: "description",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.description,
        },
        {
            key: "display_name_alternatives",
            entityType: "domains",
            entityId: "domains",
            displayName: "alternate names",
            type: "search",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.display_name_alternatives,
        },
        {
            key: "fields",
            entityType: "domains",
            entityId: "domains",
            displayName: "fields (children)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.fields,
        },
        {
            key: "siblings",
            entityType: "domains",
            entityId: "domains",
            displayName: "other domains (siblings)",
            type: "select",
            categories: ["other"],
            icon: "mdi-tag-outline",
            extractFn: (e) => e.siblings,
        },

        // types
        {
            key: "description",
            entityType: "types",
            entityId: "types",
            displayName: "description",
            type: "search",
            categories: ["other"],
            icon: "mdi-shape-outline",
            extractFn: (e) => e.description,
        },
        {
            key: "crossref_types",
            entityType: "types",
            entityId: "types",
            displayName: "alternate names (Crossref)",
            type: "select",
            categories: ["other"],
            icon: "mdi-shape-outline",
            extractFn: (e) => e.crossref_types,
        },

        // continents
        {
            key: "countries",
            entityType: "continents",
            entityId: "continents",
            displayName: "countries",
            type: "select",
            categories: ["other"],
            icon: "mdi-earth",
            extractFn: (e) => e.countries,
        },


    ]

    const worksCountFilters = getEntityConfigs()
        .map(c => c.name)
        .filter(name => name !== 'works')
        .map(name => {
            return {
                key: "works_count",
                entityType: name,
                displayName: "works count",
                type: "range",
                sortByValue: true,
                category: "citation",
                actions: ["filter", "sort", "column",],
                actionsPopular: ["sort", "column",],
                icon: "mdi-file-document-multiple-outline",
                isMultiple: true,
                isDisplayedAsCount: true,
                extractFn: (entity) => entity.works_count,
            }
        })

    const citedByCountFilters = getEntityConfigs()
        .map(c => c.name)
        .filter(name => name !== 'works')
        .map(name => {
            return {
                key: "cited_by_count",
                entityType: name,
                displayName: "citations count",
                type: "range",
                sortByValue: true,
                category: "citation",
                actions: ["filter", "column", "sort"],
                actionsPopular: ["column", "sort"],
                icon: "mdi-format-quote-close",
                isMultiple: true,
                isDisplayedAsCount: true,
                extractFn: (entity) => entity.cited_by_count,
            }
        })

    const allConfigs = [
        ...ret,
        ...worksCountFilters,
        ...citedByCountFilters,
    ]


    const manipulated = allConfigs
        // .filter(f => onlyReturnTheseFacets.includes(f.key))
        .map(config => {
            return {
                ...config,
                // values: [],
            }
        })
        .filter(config => {
            return !entityType || config.entityType === entityType
        })

    manipulated.sort((a, b) => {
        return a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1 : -1
    })

    return manipulated
}


const getFacetConfig = function (entityType, key) {
    if (!key || !entityType) return
    // hack time
    if (key === "relevance_score") {
        return {
            key: "relevance_score",
            displayName: "Relevance score",
            icon: "mdi-magnify",
            type: "search",
        }
    }

    // more hack time
    key = key.replace("primary_location.source.host_organization_lineage", "primary_location.source.publisher_lineage")


    const myFacetConfig = facetConfigs().find(f => f.key === key && f.entityType === entityType)
    if (!myFacetConfig) {
        const msg = `openAlex error: getFacetConfig(): no facet found for '${entityType}' filter "${key}"`
        console.log(msg)
        throw new Error(msg)

    }
    return myFacetConfig
}


const findFacetConfigs = function (entityType, searchString) {
    const ret = facetConfigs(entityType)
        .filter(c => {
            return c.entityType === entityType
        })
        .filter(c => {
            return c.displayName.toLowerCase().match(searchString?.toLowerCase())
        })

    const sorted = sortByKey(ret, "displayName")
    return sorted
}


const facetsByCategory = function (
    entityType,
    searchString = "",
    includeOnlyTypes = [],
    excludeFiltersByKey = [],
) {
    const filtered = facetConfigs(entityType)
        .filter(c => {
            return !searchString || c.displayName.toLowerCase().match(searchString?.toLowerCase())
        })
        .filter(c => {
            return !includeOnlyTypes.length || includeOnlyTypes.includes(c.type)
        })
        .filter(c => {
            return !excludeFiltersByKey.length || !excludeFiltersByKey.includes(c.key)
        })


    return facetCategories[entityType].map(categoryName => {
        const myFacets = filtered.filter(f => {
            return f.categories.includes(categoryName)
        })

        return {
            displayName: categoryName,
            icon: facetCategoriesIcons[categoryName],
            filterConfigs: myFacets,
        }
    })
        .filter(categoryObj => {
            return categoryObj.filterConfigs.length > 0
        })
        .filter(categoryObj => {
            return !(searchString && categoryObj.displayName === "popular")
        })


}


export {
    facetConfigs,
    getFacetConfig,
    facetCategories,
    facetsByCategory,
    findFacetConfigs,
}






