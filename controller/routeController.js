const axios = require("axios");
const { Route } = require("../model");

exports.createRoute = async (req, res) => {
  const { from, to } = req.body;
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${from}.json?access_token=pk.eyJ1IjoibWFuaXNoYmFzbmV0IiwiYSI6ImNsZjZmeno4aTFtZTczeW56ejdrNDNiNTAifQ.jYh8LZ3edkWkLeGcGdWwDA&country=NP`
  );
  const response2 = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${to}.json?access_token=pk.eyJ1IjoibWFuaXNoYmFzbmV0IiwiYSI6ImNsZjZmeno4aTFtZTczeW56ejdrNDNiNTAifQ.jYh8LZ3edkWkLeGcGdWwDA&country=NP`
  );

  const fromData = response.data.features[0].geometry.coordinates;
  const toData = response2.data.features[0].geometry.coordinates;
  console.log(fromData, toData);

  const routeDatas = await Route.create({
    fromLng: fromData[0],
    fromLat: fromData[1],
    toLng: toData[0],
    toLat: toData[1],


    from: from,
    to: to,
    fromOriginal : from,
    toOrginal : to,
    fromLatOriginal : fromData[0],
    fromLngOriginal : fromData[1],

  });

  res.json({
    status: 200,
    message: "Data received successfully!",
    routeDatas,
  });
};

exports.getRoutes = async (req, res) => {
  const routeDatas = await Route.findAll();
  res.json({
    status: 200,
    message: "Data received successfully!",
    routeDatas,
  });
};

exports.updateRoute = async (req, res) => {
  const { id } = req.params;
  const { from } = req.body;

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${from}.json?access_token=pk.eyJ1IjoibWFuaXNoYmFzbmV0IiwiYSI6ImNsZjZmeno4aTFtZTczeW56ejdrNDNiNTAifQ.jYh8LZ3edkWkLeGcGdWwDA&country=NP`
  );

  const fromData = response.data.features[0].geometry.coordinates;

  const routeDatas = await Route.update(
    {
      fromLng: fromData[0],
      fromLat: fromData[1],
      from: from,
    },

    {
      where: {
        id: id,
      },
    }
  );

  res.json({
    status: 200,
    message: "Data received successfully!",
    routeDatas,
  });
};

exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  const routeDatas = await Route.destroy({
    where: {
      id: id,
    },
  });

  res.json({
    status: 200,
    message: "Data received successfully!",
    routeDatas,
  });
};

exports.getAllRoutes = async (req, res) => {
  const routeDatas = await Route.findAll();
  // separate the form and to data
  const fromData = routeDatas.map((data) => data.from);
  const toData = routeDatas.map((data) => data.to);

  res.json({
    status: 200,
    message: "Data received successfully!",
    routeDatas,
    fromData,
    toData,
  });
};
