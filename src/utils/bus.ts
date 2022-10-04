import mitt from 'mitt'

type Emits<EventType extends string | symbol, T> = {
  on(type: EventType, handler: (arg: T) => void): void,
  off(type: EventType, handler: (arg: T) => void): void
  emit(type: EventType, arg: T): void
}

type Emitter = Emits<'passKeyWord', string>

const emitter: Emitter = mitt<Emitter>()

export default emitter
