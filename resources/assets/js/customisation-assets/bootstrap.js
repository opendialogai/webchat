import {registerCustomChatModes} from "./registerChatModes";
import {registerCustomBootstrapFunctions} from "./registerCustomBootstrapFunctions";
import {registerHooks} from "./registerHooks";

/**
 * Defines an object that Webchat consumes, allowing for custom functionality.
 */
window.openDialogWebchat = {
    chatService: {
        getCustomModes() {
            return registerCustomChatModes();
        }
    },
    bootstrap: {
        customBootstrapFunctions: (defaultBootstrapFunctions) => {
            return registerCustomBootstrapFunctions(defaultBootstrapFunctions);
        }
    },
    hooks: registerHooks()
};
