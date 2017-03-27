export interface ICancellationToken {
	isCancellationRequested: boolean;
	onCancellationRequested: Function;
}