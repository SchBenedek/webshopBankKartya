import {Body, Controller, Get, HttpRedirectResponse, Post, Redirect, Render, Res  } from '@nestjs/common';
import { AppService } from './app.service';
import { Adatok } from './Adatok.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  #Adatok:Adatok[]=[];

  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return{
      data:{},
      errors:[]
    }
  }

  @Post("megadas")
  megadas(
    @Body() Adatok:Adatok,
    @Res() response: Response)
  {
    console.log(Adatok)
    let errors=[];

    if(!Adatok.nev||!Adatok.bankszamla)
    {
      errors.push("Minden mező kitöltése kötelező!")
    }
    if(!/^.{1,}$/.test(Adatok.nev))
    {
      errors.push("Ilyen név nem létezik!")
    }
    if(!/^(\d{8}-\d{8}(-\d{8})?)?$/.test(Adatok.bankszamla))
    {
      errors.push("Bankszámla format: XXXXXXXXX-XXXXXX-XXXXXX vagy XXXXXXXXX-XXXXXX")
    }
    if(!Adatok.szerzodesiFeltet)
    {
      errors.push("Nem fogadta el a szerződési feltételeket!")
    }
    if (errors.length > 0) {
      response.render('index', {
        data: Adatok,
        errors
      })
      return
    }
    
    const Megadas:Adatok={
      nev: Adatok.nev,
      bankszamla: Adatok.bankszamla,
      szerzodesiFeltet: Adatok.szerzodesiFeltet
    }
    this.#Adatok.push(Megadas);
    console.log(this.#Adatok);
    const fs = require('fs');
    const szoveg = `${Adatok.nev},${Adatok.bankszamla};\n`;
    fs.appendFileSync("a.csv", szoveg);
    return response.redirect('/success');
  }

  @Get('success')
  @Render('success')
  rSuccess(){
    return;
  }

  @Post("vissza")
  vissza(@Res() response: Response){
    return response.redirect('/');
  }
}
