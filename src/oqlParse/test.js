const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Import the function to be tested
const oqlToQuery = require('./oqlParse');

// Load test cases from the JSON file
const testsFilePath = path.join(__dirname, 'tests.json');
const testCases = JSON.parse(fs.readFileSync(testsFilePath, 'utf8'));


function queriesEqual(query1, query2, path = '') {
  function logDifference(prop, value1, value2) {
    console.log(`Difference at ${path}${prop}:`);
    console.log(`  Query 1: ${JSON.stringify(value1)}`);
    console.log(`  Query 2: ${JSON.stringify(value2)}`);
  }

  // Helper function to compare two filters
  function compareFilters(filter1, filter2, filterPath) {
    if (!filter1 && !filter2) return true;
    if (!filter1 || !filter2) {
      logDifference(filterPath, filter1, filter2);
      return false;
    }

    if (filter1.type !== filter2.type || filter1.subjectEntity !== filter2.subjectEntity) {
      logDifference(`${filterPath}type/subjectEntity`,
        { type: filter1.type, subjectEntity: filter1.subjectEntity },
        { type: filter2.type, subjectEntity: filter2.subjectEntity });
      return false;
    }

    if (filter1.type === 'leaf') {
      if (filter1.operator !== filter2.operator ||
          filter1.column_id !== filter2.column_id ||
          JSON.stringify(filter1.value) !== JSON.stringify(filter2.value)) {
        logDifference(`${filterPath}leaf properties`,
          { operator: filter1.operator, column_id: filter1.column_id, value: filter1.value },
          { operator: filter2.operator, column_id: filter2.column_id, value: filter2.value });
        return false;
      }
    } else if (filter1.type === 'branch') {
      if (filter1.operator !== filter2.operator || filter1.children.length !== filter2.children.length) {
        logDifference(`${filterPath}branch properties`,
          { operator: filter1.operator, childrenLength: filter1.children.length },
          { operator: filter2.operator, childrenLength: filter2.children.length });
        return false;
      }
      return filter1.children.every((childId, index) => {
        const childFilter1 = query1.filters.find(f => f.id === childId);
        const childFilter2 = query2.filters.find(f => f.id === filter2.children[index]);
        return compareFilters(childFilter1, childFilter2, `${filterPath}children[${index}].`);
      });
    }
    return true;
  }

  // Handle empty objects
  if (Object.keys(query1).length === 0 && Object.keys(query2).length === 0) {
    return true;
  }

  // Compare non-filter properties
  const properties = ['summarize', 'summarize_by', 'sort_by', 'return'];
  for (const prop of properties) {
    if (prop in query1 || prop in query2) {
      if (JSON.stringify(query1[prop]) !== JSON.stringify(query2[prop])) {
        logDifference(prop, query1[prop], query2[prop]);
        return false;
      }
    }
  }

  // Compare filters
  if ('filters' in query1 || 'filters' in query2) {
    if (!query1.filters || !query2.filters || query1.filters.length !== query2.filters.length) {
      logDifference('filters', query1.filters, query2.filters);
      return false;
    }

    // Find and compare root filters
    const rootFilter1 = query1.filters.find(f => f.isRoot);
    const rootFilter2 = query2.filters.find(f => f.isRoot);

    if (!rootFilter1 && !rootFilter2) {
      return true;
    }
    if (!rootFilter1 || !rootFilter2) {
      logDifference('root filter', rootFilter1, rootFilter2);
      return false;
    }

    return compareFilters(rootFilter1, rootFilter2, 'filters.root.');
  }

  return true;
}

// Run the tests
testCases.forEach((testCase, index) => {
    const { oql, query: expectedQuery } = testCase;
    let generatedQuery;

    try {
        generatedQuery = oqlToQuery(oql);

        if (queriesEqual(generatedQuery, expectedQuery)) {
            console.log(`Test case ${index + 1} passed.`);
        } else {
            throw new Error('Objects are not equal');
        }
    } catch (error) {
        console.error(`Test case ${index + 1} failed.`);
        console.error(`OQL: ${oql}`);
        console.error(`Expected: ${JSON.stringify(expectedQuery, null, 2)}`);
        console.error(`Generated: ${JSON.stringify(generatedQuery, null, 2)}`);
        console.error(`Error: ${error.message}`);
    }
});