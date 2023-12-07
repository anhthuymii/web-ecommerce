import axios from "axios";

const search = async (searchTerm) => {
  let data = JSON.stringify({
    query: {
      bool: {
        should: [
          {
            match: {
              name: {
                query: searchTerm,
                operator: "or",
                boost: 5,
              },
            },
          },
          {
            multi_match: {
              fields: ["fullText^1", "fullTextBoosted^5"],
              query: searchTerm,
              fuzziness: "1",
            },
          },
        ],
      },
    },
    sort: [
      {
        _score: {
          order: "desc",
        },
      },
    ],
    // from: (page - 1) * limit,
    // size: limit,
    from: 0,
    size: 100,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://jeanostore.es.us-central1.gcp.cloud.es.io/v1/_search",
    headers: {
      Authorization:
        "ApiKey UEItV1Fvd0JXczdqV2pDZ056NGw6bG9YX2h4Qk1SbldOazZNSHF1cFZlQQ",
      "Content-Type": "application/json",
    },
    data: data,
  };

  const res = await axios.request(config);
  return res.data;
};

const esService = { search };
export default esService;

// route("/api/search/", es.search)
