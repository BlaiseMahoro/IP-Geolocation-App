const Observable = require("tns-core-modules/data/observable").Observable;
const SelectedPageService = require("../shared/selected-page-service");
const frame = require("tns-core-modules/ui/frame");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const tzlookup = require("tz-lookup");
const appSettings = require("tns-core-modules/application-settings");
const distKm = 0;
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1); // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km

	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}
function kmToMiles(dist) {
    return dist * 0.62;
}
function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");

    const viewModel = new Observable();
    const theme = appSettings.getString("theme", "dark");
    let bgColor;
    let textColor;
    if (theme === "dark") {

        bgColor = "black";
        textColor = "white";
    } else {
        bgColor = "white";
        textColor = "black";
    }
    viewModel.set("bgColor", bgColor);
    viewModel.set("textColor", textColor);

    viewModel.search = (args) => {
        const page = frame.topmost().currentPage;
        // eslint-disable-next-line no-var
        var ipAddr = getViewById(page, "search_id").text;
        if (ipAddr === "") { //get this devices
            const url = "https://api.ipify.org?format=json";
            // eslint-disable-next-line no-undef
            fetch(url)
                .then((r) =>
                    //console.log(r);
                    r.json()
                )
                .then((json) => {
                    //console.log(json.ip);
                    ipAddr = json.ip;
                    const url = `https://salty-journey-20244.herokuapp.com/ip_api?address=${ipAddr}`;
                    // eslint-disable-next-line no-undef
                    fetch(url)
                        .then((r) =>
                            //console.log(r);
                            r.json()
                        )
                        .then((json) => {
                            console.log("ipAdd", ipAddr);
                            const country = json.country;
                            viewModel.set("country", country);
                            viewModel.set("ip_add", `${ipAddr}(this device)`);
                            viewModel.set("timezone", json.timezone);
                            viewModel.set("error_msg", "");
                            viewModel.set("distance", "0 miles");

                        });
                });
        } else {
            const url = "https://api.ipify.org?format=json";
            // eslint-disable-next-line no-undef
            fetch(url)
                .then((r) =>
                    //console.log(r);
                    r.json()
                )
                .then((json) => {
                    const currIP = json.ip;

            const url = `https://salty-journey-20244.herokuapp.com/ip_api?address=${ipAddr}`;
            // eslint-disable-next-line no-undef
            fetch(url)
                .then((r) =>
                    //console.log(r);
                    r.json()
                )
                .then((json) => {
                    // const timezone = tzlookup(
                    //     json.geo.latitude,
                    //     json.geo.longitude
                    // );
                    console.log("ipAdd", ipAddr);
                    const country = json.country;
                    viewModel.set("country", country);
                    viewModel.set("ip_add", json.query);
                    viewModel.set("timezone", json.timezone);
                    viewModel.set("error_msg", "");
                    console.log("currIP", currIP);
                    const url = `https://salty-journey-20244.herokuapp.com/ip_api?address=${currIP}`;

                    // eslint-disable-next-line no-undef
                    fetch(url)
                        .then((r) =>
                            //console.log(r);
                            r.json()
                        )
                        .then((json) => {
                            //console.log("Geo", json.geo);
                            const ip1Geo = { "latitude":json.lat,
                                            "longitude":json.lon };
                                            console.log("Geo", ip1Geo);
                            const url = `https://salty-journey-20244.herokuapp.com/ip_api?address=${ipAddr}`;

                            // eslint-disable-next-line no-undef
                            fetch(url)
                                .then((r) =>
                                    //console.log(r);
                                    r.json()
                                )
                                .then((json) => {
                                    //console.log("Geo", json.geo);
                                    const ip2Geo = { "latitude":json.lat,
                                    "longitude":json.lon };
                                    console.log("Geo", ip2Geo);
                                    const distanceKm = getDistanceFromLatLonInKm(ip1Geo.latitude, ip1Geo.longitude, ip2Geo.latitude, ip2Geo.longitude);
                                    console.log("dist", kmToMiles(distanceKm));

                                    const distMiles = kmToMiles(distanceKm);
                                    viewModel.set("distance", `${distMiles} miles`);
                                });

                        });


                }).catch((e) => {
                    viewModel.set("error_msg", "Invalid input. Please input a public IPv4 address");
                    viewModel.set("country", "");
                    viewModel.set("ip_add", "");
                    viewModel.set("timezone", "");


                });
            });
        }
    };

    return viewModel;
}

module.exports = HomeViewModel;
