/**
 * Returns an object of functions that can override the default bootstrap functions in opendialog-bot(-full).js.
 * The default bootstrap functions are passed as parameter here so we can still run them, allowing us to add custom
 * functionality before or after the default function, or to omit the default function completely.
 */
export const registerCustomBootstrapFunctions = function (defaultBootstrapFunctions) {
    let functions = {};

    functions = {
        // isValidPath: async () => {
        //   return await defaultBootstrapFunctions.isValidPath();
        // },
        // openChatWindow: async (url, div = null) => {
        //   defaultBootstrapFunctions.openChatWindow(url, div);
        // },
        // addUrlUpdatedListener: () => {
        //   return defaultBootstrapFunctions.addUrlUpdatedListener();
        // }
    };

    return functions;
};
