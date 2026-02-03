import tooltipImg from "../assets/tooltip.svg"

type Props = {
	tooltip: string;
	css?: string;
	btnCSS?: string;
};

export default function TooltipButton({ tooltip, css, btnCSS }: Props) {
	css = css == undefined ? "" : css;
	btnCSS = btnCSS == undefined ? "" : btnCSS;
	return (
		<div className={`tooltip ${css}`} data-tip={tooltip}>
			<button className={`btn btn-xs rounded-lg ${btnCSS}`}><img className="w-4" src={tooltipImg}/></button>
		</div>
	);
}
