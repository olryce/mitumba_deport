import {
    $query, $update, Record,    
    StableBTreeMap,    Vec,    
    match, Result, nat64,
    ic, Opt, Principal,
  } from "azle";
  import { v4 as uuidv4 } from "uuid";
  
  type Mitumba = Record<{
    id: string;
    name: string;
    designer: string;
    gender: string; 
    price: string; 
    quality: string; 
    companyName: string; 
    image: string;
    owner: Principal;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
  }>;
  
  type MitumbaPayload = Record<{
    name: string;
    designer: string;
    gender: string;
    description: string;
    price: string;
    quality: string;
    companyName: string; 
    image: string;
  }>;
  
  const mitumbaStorage = new StableBTreeMap<string, Mitumba>(0, 44, 1024);

  $update;
  export function CreateMitumba(payload: MitumbaPayload): Result<Mitumba, string> {
    const mitumba : Mitumba = {
      id: uuidv4(),
      createdAt: ic.time(),
      updatedAt: Opt.None,
      ...payload,
      owner: ic.caller(),

    };
    mitumbaStorage.insert(mitumba.id, mitumba);
    return Result.Ok<Mitumba, string>(mitumba);
  }
  
  // $update;
  // export function createMitumba(payload: MitumbaPayload): Result<Mitumba, string> {
  //   const mitumba: Mitumba = {
  //     id: uuidv4(),
  //     createdAt: ic.time(),
  //     updatedAt: Opt.None,
  //     ...payload,
  //     owner: ic.caller(),
  //   };
  
  //   mitumbaStorage.insert(mitumba.id, mitumba);
  //   return Result.Ok<Mitumba, string>(mitumba);
  // }
  
  $query;
  export function getMitumbaById(id: string): Result<Mitumba, string> {
    return match(mitumbaStorage.get(id), {
      Some: (mitumba) => Result.Ok<Mitumba, string>(mitumba),
      None: () => Result.Err<Mitumba, string>(`mitumba with id=${id} not found.`),
    });
  }
  $query;
  export function getMitumbaByName(name: string): Result<Mitumba, string> {
    const mitumba = mitumbaStorage.values();
  
    const foundMitumba = mitumba.find((mitumba) => mitumba.name.toLowerCase() === name.toLowerCase());
  
    if (foundMitumba) {
      return Result.Ok<Mitumba, string>(foundMitumba);
    }
  
    return Result.Err<Mitumba, string>(`Mitumba with name="${name}" not found.`);
  }
  
  
  $query;
  export function getAllMitumba(): Result<Vec<Mitumba>, string> {
    return Result.Ok(mitumbaStorage.values());
  }
  
  $update;
  export function updateMitumba(id: string, payload: MitumbaPayload): Result<Mitumba, string> {
    return match(mitumbaStorage.get(id), {
      Some: (existingMitumba) => {
        const updatedMitumba: Mitumba = {
          ...existingMitumba,
          ...payload,
          updatedAt: Opt.Some(ic.time()),
        };
  
        mitumbaStorage.insert(updatedMitumba.id, updatedMitumba);
        return Result.Ok<Mitumba, string>(updatedMitumba);
      },
      None: () => Result.Err<Mitumba, string>(`Car with id=${id} not found.`),
    });
  }
  
  $update;
  export function deleteMitumba(id: string): Result<Mitumba, string> {
    return match(mitumbaStorage.get(id), {
      Some: (existingMitumba) => {
        mitumbaStorage.remove(id);
        return Result.Ok<Mitumba, string>(existingMitumba);
      },
      None: () => Result.Err<Mitumba, string>(`Mitumba Bail with id=${id} not found.`),
    });
  }
  globalThis.crypto = {
    //@ts-ignore
    getRandomValues: () => {
      let array = new Uint8Array(32);
  
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
  
      return array;
    },
  };
  
  // this is a dynamic TypeScript web application designed to revolutionize the way you manage and find second hand cloths. Our project empowers users to seamlessly perform CRUD (Create, Read, Update, Delete) operations on Mitumba cloths while providing personalized cloth recommendations based on user preferences.