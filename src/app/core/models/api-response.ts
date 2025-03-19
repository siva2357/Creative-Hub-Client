export class ApiResponse<T> {
  constructor(public requestId?: string, public data?: T) {}
}
