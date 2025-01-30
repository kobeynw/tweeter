import useToastListener from "../toaster/ToastListenerHook";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
    overlayID: string;
    overlayTooltipText: string;
    overlayIcon: IconProp;
}

const FieldButton = (props: Props) => {
    const { displayInfoMessage } = useToastListener();

    const displayInfoMessageWithDarkBackground = (message: string): void => {
        displayInfoMessage(message, 3000, "text-white bg-primary");
    };

    return (
        <button
            type="button"
            className="btn btn-link btn-floating mx-1"
            onClick={() =>
                displayInfoMessageWithDarkBackground(`${props.overlayTooltipText} registration is not implemented.`)
            }
        >
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={props.overlayID}>{props.overlayTooltipText}</Tooltip>}
            >
                <FontAwesomeIcon icon={props.overlayIcon} />
            </OverlayTrigger>
        </button>
    );
}

const OAuth = () => {
    return (
        <div className="text-center mb-3">
            <FieldButton 
                overlayID="googleTooltip"
                overlayTooltipText="Google"
                overlayIcon={["fab", "google"]}
            />

            <FieldButton 
                overlayID="facebookTooltip"
                overlayTooltipText="Facebook"
                overlayIcon={["fab", "facebook"]}
            />

            <FieldButton 
                overlayID="twitterTooltip"
                overlayTooltipText="Twitter"
                overlayIcon={["fab", "twitter"]}
            />

            <FieldButton 
                overlayID="linkedinTooltip"
                overlayTooltipText="LinkedIn"
                overlayIcon={["fab", "linkedin"]}
            />

            <FieldButton 
                overlayID="githubTooltip"
                overlayTooltipText="Github"
                overlayIcon={["fab", "github"]}
            />
        </div>
    );
}

export default OAuth;