export type Alert = {
	msg: string;
	isAlert: boolean;
};

type Props = {
	alert: Alert;
};

export default function AlertModalBody({ alert }: Props) {
    return (
        <ul>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt eaque doloribus sequi illo illum asperiores ab, a ullam quidem iste vel accusamus. Debitis deleniti perspiciatis at deserunt numquam hic fugiat?
        </ul>
    )
}
