const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;
const SelectedPageService = require("../shared/selected-page-service");
const appSettings = require("tns-core-modules/application-settings");
function FeaturedViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("FAQ");
    const viewModel = new Observable();
    let theme = appSettings.getString("theme", "dark");
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
    
    return viewModel;

}

module.exports = FeaturedViewModel;
