import {
  LoaderFunction,
  useLoaderData,
  ActionFunction,
  redirect,
  json,
  useActionData,
} from 'remix'
import type { Location } from '@prisma/client'
import { db } from '~/db/db.server'

type LoaderData = {
  gameId: string
  location: Location
}

type ActionData = {
  formError?: string
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

function validateToLocationId(toLocationId: string) {
  if (toLocationId.length < 1) {
    return `Invalid toLocationId`
  }
}
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const toLocationId = form.get('toLocationId')
  if (typeof toLocationId !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`,
    })
  }

  //if //toLocationId niet een geldige destination voor de huidige locatie:
  //  return badRequest({ fieldErrors, fields });
  //}

  const game = await db.game.findFirst()

  //  if (!game)   return badRequest(game bestaat niet...);

  await db.game.update({
    where: { id: game.id },
    data: { currentLocationId: toLocationId },
  })

  //deze redirect schijnt niet te mogen/kunnen of zo???
  return redirect(`/`)
}

export const loader: LoaderFunction = async () => {
  const game = await db.game.findFirst()

  if (!game) throw new Error('No game found')

  const location = await db.location.findUnique({
    where: { id: game.currentLocationId },
    include: { destinations: true, origins: true },
  })

  if (!location) throw new Error('No location found')

  const data: LoaderData = {
    gameId: game.id,
    location,
  }

  return data
}

export default function Index() {
  const actionData = useActionData<ActionData>()
  const data = useLoaderData<LoaderData>()

  return (
    <div>
      <h2>{data.location.name}</h2>

      <p>{data.location.description}</p>

      <div>
        Destinations:
        <form method="post">
          {data.location.destinations.map((destination) => (
            <span key={destination.id}>
              <button name="toLocationId" type="submit">
                {destination.name}
              </button>
            </span>
          ))}
        </form>
      </div>

      <div>
        Origins (DIT KAN WEG):
        <form method="post">
          {data.location.origins.map((origin) => (
            <span key={origin.id}>
              <button name="toLocationId" type="submit">
                {origin.name}
              </button>
            </span>
          ))}
        </form>
      </div>
    </div>
  )
}
