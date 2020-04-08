const Observable = require("tns-core-modules/data/observable").Observable;
const SelectedPageService = require("../shared/selected-page-service");
const frame = require("tns-core-modules/ui/frame");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const tzlookup = require("tz-lookup");
function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");

    const viewModel = new Observable();
    viewModel.search = (args) => {
        const page = frame.topmost().currentPage;
        // eslint-disable-next-line no-var
        var ipAddr = getViewById(page, "search_id").text;
        if (ipAddr == "") { //get this devices
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
                    const url = `https://api.ipgeolocationapi.com/geolocate/${ipAddr}`;

                    // eslint-disable-next-line no-undef
                    fetch(url)
                        .then((r) =>
                            //console.log(r);
                            r.json()
                        )
                        .then((json) => {
                            console.log(json.geo);

                            const timezone = tzlookup(
                                json.geo.latitude,
                                json.geo.longitude
                            );
                            console.log("ipAdd", ipAddr);
                            const country = json.name;
                            viewModel.set("country", country);
                            viewModel.set("ip_add", `${ipAddr}(this device)`);
                            viewModel.set("timezone", timezone);
                            viewModel.set("error_msg", "");

                        });
                });
        } else {
            const url = `https://api.ipgeolocationapi.com/geolocate/${ipAddr}`;
            // eslint-disable-next-line no-undef
            fetch(url)
                .then((r) =>
                    //console.log(r);
                    r.json()
                )
                .then((json) => {
                    const timezone = tzlookup(
                        json.geo.latitude,
                        json.geo.longitude
                    );
                    console.log("ipAdd", ipAddr);
                    const country = json.name;
                    viewModel.set("country", country);
                    viewModel.set("ip_add", ipAddr);
                    viewModel.set("timezone", timezone);
                    viewModel.set("error_msg", "");
                }).catch((e) => {
                    viewModel.set("error_msg", "Invalid input. Please input a public IPv4 address");
                    viewModel.set("country", "");
                    viewModel.set("ip_add", "");
                    viewModel.set("timezone", "");

                });
        }
    };

    return viewModel;
}

module.exports = HomeViewModel;
