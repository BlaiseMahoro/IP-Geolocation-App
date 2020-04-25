const observableModule = require("tns-core-modules/data/observable");
const appSettings = require("tns-core-modules/application-settings");
const SelectedPageService = require("../shared/selected-page-service");
const Observable = require("tns-core-modules/data/observable").Observable;
function BrowseViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("About");
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
    const viewModel = new Observable();
    viewModel.set("bgColor", bgColor);
    viewModel.set("textColor", textColor);

    return viewModel;
}

module.exports = BrowseViewModel;
