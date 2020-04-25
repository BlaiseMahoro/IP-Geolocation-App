const Observable = require("tns-core-modules/data/observable").Observable;
const SelectedPageService = require("../shared/selected-page-service");
const themes = ["dark", "light"];
const appSettings = require("tns-core-modules/application-settings");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const frame = require("tns-core-modules/ui/frame");
function SettingsViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Settings");

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
    const curr_theme = themes.indexOf(theme);
    viewModel.set("themes", themes);
    viewModel.set("curr_theme", curr_theme);
    viewModel.set("bgColor", bgColor);
    viewModel.set("textColor", textColor);
    viewModel.onListPickerLoaded = (args) => {
        const listPicker = args.object;
        listPicker.on("selectedIndexChange", (lpargs) => {
            const picker = lpargs.object;
            console.log(`ListPicker selected value: ${picker.selectedValue} ListPicker selected index: ${picker.selectedIndex}`);
            //theme = themes[picker.selectedValue];
            // console.log("theme", theme);
            // if (theme === "dark") {

            //     bgColor = "black";
            //     textColor = "white";
            // } else {
            //     bgColor = "white";
            //     textColor = "black";
            // }
            // viewModel.set("bgColor", bgColor);
            // viewModel.set("textColor", textColor);
        });
    };
        viewModel.onApplyTap = () => {
            const page = frame.topmost().currentPage;
            const lpicker1 = getViewById(page, "theme-pick");
            theme = themes[lpicker1.selectedIndex];

           if (theme === "dark") {

                bgColor = "black";
                textColor = "white";
            } else {
                bgColor = "white";
                textColor = "black";
            }
            viewModel.set("bgColor", bgColor);
            viewModel.set("textColor", textColor);
            appSettings.setString("theme", theme);
            viewModel.set("curr_theme", themes.indexOf(theme));
    };

    return viewModel;
}

module.exports = SettingsViewModel;
