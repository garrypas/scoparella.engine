type fnCreate<TObj> = (deserialized: any) => TObj;

export function fromJson<TObj>(json: string, create: fnCreate<TObj>): TObj {
    const deserialized: TObj = JSON.parse(json)
    return create(deserialized);
}