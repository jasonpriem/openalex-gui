import axios from 'axios'
import _ from 'lodash'
import {url} from "@/url";
import {createDisplayFilter, createSimpleFilter, filtersAsUrlStr} from "@/filterConfigs";
import {openAlexCountries} from "@/countries";
import countryCodeLookup from "country-code-lookup";
import {getFacetConfig} from "@/facetConfigs";
import {openAlexSdgs} from "@/sdgs";
import {entityTypeFromId, shortenOpenAlexId} from "@/util";
import {isOpenAlexId} from "./util";
import {filter} from "core-js/internals/array-iteration";
import {getActionDefaultsStr} from "@/actionConfigs";

import ISO6391 from 'iso-639-1'
import {entityConfigs, getEntityConfig} from "@/entityConfigs";
import {sleep} from "./util";

const cache = {}
const entityCache = {}
const getFromCache = function (url) {
    if (!cache[url]) return
    return _.cloneDeep(cache[url])
}
const getEntityFromCache = function (id) {
    const myId = shortenOpenAlexId(id)
    if (!myId) return
    if (!entityCache[myId]) return
    return _.cloneDeep(entityCache[myId])
}
const clearCache = function () {
    Object.keys(cache).forEach(k => {
        cache[k] = null
    })
    Object.keys(entityCache).forEach(k => {
        cache[k] = null
    })
}
const stockCache = function (url, ret) {
    cache[url] = ret
}

let urlBase = {
    api: "https://api.openalex.org",
    web: "https://explore.openalex.org",
    relative: "",
}


// this lets you develop against a local API endpoint
// to set the port, when you start your dev server, use: npm run serve -- --port <my port num>
// example:
// npm run serve -- --port 8081
if (window.location.port && parseInt(window.location.port) === 8081) {
    urlBase.api = "http://localhost:5004/"  // your locally-hosted API
    console.log("Setting API base URL to local machine (dev use only): " + urlBase.api)
} else if (window.location.port && parseInt(window.location.port) === 8082) {
    urlBase.api = "https://staging-jump-api.herokuapp.com/"  // staging heroku url
    console.log("Setting API base URL to staging heroku (dev use only): " + urlBase.api)
}

// hack to get around the lack of an autocomplete endpoint for countries
const autocompleteCountry = function (searchString) {
    return openAlexCountries
        .filter(c => {
            return c.display_name.toLowerCase().includes(searchString.toLowerCase())
        })
}

// @pathName is the path, like /works
// @searchParams can be in these formats:
//      {foo: 42, bar: 43}
//      [["foo", 42], ["bar", 43]]
//      ?foo=42&bar=43
// @base is "web" or "api"
const makeUrl = function (pathName, searchParams, includeEmail = true) {
    const params = new URLSearchParams(searchParams);
    (includeEmail) && params.set("mailto", "team@ourresearch.org");
    !params.get("per-page") && params.set("per-page", 10)

    if (pathName.indexOf("/") !== 0) {
        pathName = "/" + pathName
    }
    const baseAndPath = urlBase.api + pathName;
    const paramsStr = [...params.entries()]
        .filter(p => {
            return p[1]
        })
        .map(p => {
            return p[0] + "=" + p[1]
        })
        .join("&")

    return [baseAndPath, paramsStr].join("?")
}


const api = (function () {
    const getUrl = async function (url) {
        if (url.includes("filter=")) { // sdgs hack
            url = url.replace("sdgs/", "")
        }

        const cachedResponse = getFromCache(url)
        if (cachedResponse) {
            return cachedResponse
        }

        let res
        try {
            res = await axios.get(url)
            // console.log(`api GET ${url} success:`, res.data)
        } catch (e) {
            // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
            console.log("api GET failure:", e.response)
            throw e
        }
        cache[url] = res.data
        return res.data
    }
    const getResultsList = async function (url) {
        const ret = getUrl(url)
        return ret
    }

    const getEntity = async function (id) {
        const myUrl = makeUrl(id)
        const resp = await getUrl(myUrl)
        return resp
    }

    const getEntityDisplayName = async function (entityName, id) {
        const path = entityName + "/" + id
        const myUrl = makeUrl(path, {select: "display_name"})
        const resp = await getUrl(myUrl)
        return resp.display_name
    }

    const getFilterValueDisplayName = async function (filterKey, filterValue) {
        const entityId = getFacetConfig("works", filterKey)?.entityId

        if (filterKey === "institutions.country_code") {
            return openAlexCountries.find(c => c.id.toLowerCase() === filterValue.toLowerCase())?.display_name
        } else if (filterKey === "sustainable_development_goals.id") {
            return openAlexSdgs.find(c => c.id.toLowerCase() === filterValue.toLowerCase())?.display_name
        } else if (filterKey === "language") {
            return ISO6391.getName(filterValue.toLowerCase())
        } else if (entityId) {
            return await getEntityDisplayName(entityId, filterValue)
        } else {
            return filterValue
        }
    }


    const getResultsCount = async function (entityType, filters) {
        const searchParams = {
            filter: filtersAsUrlStr(filters)
        }
        const url = makeUrl(entityType, searchParams)
        const ret = await getUrl(url)
        return ret.meta.count
    }

    const getGroups = async function (entityType, filterKey, options) {
        const myUrl = url.makeGroupByUrl(
            entityType,
            filterKey,
            options,
        )

        // const resp = await axios.get(myUrl)
        const respData = await getUrl(myUrl)
        const filteredGroups = respData.group_by.filter(g => {
            const keyIsNullish = g.key === "unknown" || g.key === null
            return !(keyIsNullish && options.hideUnknown)
        })

        // const maxGroups = (options.perPage) ? options.perPage - 1 : 25
        // const truncatedGroups = filteredGroups.splice(0, 25)
        const truncatedGroups = filteredGroups

        const groupCounts = truncatedGroups.map(g => g.count)

        const maxCount = Math.max(...groupCounts)
        const countSum = groupCounts.reduce((a, b) => a + b, 0)


        const groupDisplayFilters = truncatedGroups
            .map(group => {
                const groupKey = group.key.replaceAll("https://metadata.un.org/sdg/", "") // namespace hack

                return createDisplayFilter(
                    entityType,
                    filterKey,
                    groupKey,
                    false,
                    group.key_display_name,
                    group.count,
                    group.count / countSum,
                )
            })

        return groupDisplayFilters
    }

    const filterKeyFromAutocompleteResponse = function (result) {
        // this currently looks in result.filter_key but i think in the future we should ignore that
        // and instead get the filterKey from the entity type, extracted from the ID?

        let filterKey
        if (result.filter_key === "id") filterKey = "ids.openalex"
        else if (result.filter_key === "topics.id") filterKey = "primary_topic.id"
        else filterKey = result.filter_key
        return filterKey
    }

    const getAutocompleteResponses = async function (entityType, filterKey, searchString, filters) {
        console.log("getAutocompleteResponses", entityType, filterKey, searchString)
        if (!filterKey && entityType !== "works") {
            filterKey = "ids.openalex"
        }

        const filterValueEntityId = getFacetConfig(entityType, filterKey)?.entityId
        // console.log("getAutocompleteResponses autocompleteEntityName", filterValueEntityId)

        const myUrl = url.makeAutocompleteUrl(filterValueEntityId, searchString)
        const resp = await getUrl(myUrl)
        const suggestionFilters = resp.results
            .filter(r => !!r.id)
            .filter(r => r.entity_type !== "filter")
            .filter(r => !!r.display_name)
            .map(result => {
                const resultFilterKey = filterKey ?? filterKeyFromAutocompleteResponse(result) //
                // console.log("getAutocompleteResponses() map() resultFilterKey", resultFilterKey)


                const myFilter = createSimpleFilter(
                    entityType,
                    resultFilterKey,
                    result.id
                )
                // console.log("getAutocompleteResponses() map() myFilter", entityType, resultFilterKey, myFilter)


                const myHintVerb = getEntityConfig(myFilter.entityId)?.hintVerb ?? "-"
                const myHintString = result.hint ?? ""
                let tidyHintString = myHintString
                if (myFilter.entityId === "topics") {
                    tidyHintString = tidyHintString
                        .replace("This cluster of papers ", "")
                        .replace("covers a ", "")
                        .replace("focuses on ", "")
                        .replace("explores the ", "")
                        .replace(/^the/, "")
                        .split(".")[0]

                    tidyHintString = tidyHintString.split(", including ")[0]
                    tidyHintString = tidyHintString.split(", emphasizing ")[0]
                    tidyHintString = tidyHintString.split(", particularly focusing ")[0]
                    tidyHintString = tidyHintString.split(", focusing on ")[0]
                    tidyHintString = tidyHintString.split(", particularly emphasizing ")[0]
                    tidyHintString = tidyHintString.split(", with a particular emphasis on ")[0]
                    tidyHintString = tidyHintString[0].toUpperCase() + tidyHintString.substring(1) + "."
                }

                const hint = tidyHintString ?
                    myHintVerb + " " + tidyHintString :
                    ""

                return {
                    ...myFilter,
                    displayValue: result.display_name,
                    worksCount: result.works_count,
                    count: result.works_count,
                    hint,
                    isFromAutocomplete: true,
                }

            })
        return suggestionFilters
    }

    const getSuggestions = async function (entityType, filterKey, searchString, filters) {
        if (!searchString) {
            return await getGroups(entityType, filterKey, {
                searchString,
                filters,
            })
        } else if (!filterKey) {
            return await getAutocompleteResponses(entityType, filterKey, searchString, filters)
        } else {
            const myEntityId = getFacetConfig(entityType, filterKey)?.entityId
            const isAutocompleteEndpointAvailable = getEntityConfig(myEntityId)?.hasAutocomplete
            if (isAutocompleteEndpointAvailable && myEntityId) {
                return await getAutocompleteResponses(entityType, filterKey, searchString, filters)
            } else {
                return await getGroups(entityType, filterKey, {
                    searchString,
                    filters
                })
            }

        }
    }

    return {
        createUrl: function (pathName, searchParams, includeEmail) {
            return makeUrl(pathName, searchParams, false)
        },
        getEntityDisplayName,
        getFilterValueDisplayName,
        getUrl,
        getResultsList,
        getResultsCount,
        getEntity,
        get: async function (pathName, searchParams) {
            const url = makeUrl(pathName, searchParams)
            const resp = await getUrl(url)
            return resp
        },
        getAutocompleteResponses,
        getGroups,
        getSuggestions,

    }
})()


export {
    api,
}