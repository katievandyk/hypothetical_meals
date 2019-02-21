const Units = {
      "oz": "weight",
      "ounce": "weight",
      "lb": "weight",
      "pound": "weight",
      "ton": "weight",
      "g": "weight",
      "gram": "weight",
      "kg": "weight",
      "kilogram": "weight",
      "floz": "volume",
      "fluidounce": "volume",
      "pt": "volume",
      "pint": "volume",
      "qt": "volume",
      "quart": "volume",
      "gal": "volume",
      "gallon": "volume",
      "ml": "volume",
      "milliliter": "volume",
      "l": "volume",
      "liter": "volume",
      "ct": "count",
      "count": "count",
  }

export function isNumeric(n){
      return !isNaN(parseFloat(n)) && isFinite(n);
  }

export function unit_checker(str){
      var res = extractUnits(str)
      var num = res[0]
      var unit = res[1]
      if(!isNumeric(num))
          return false
      if (parseFloat(num) < 0)
          return false

      if (!(unit in Units)) {
          return false
      }
      return true
  }

export function extractUnits(str){
      let regex = /^(\d*\.?\d+)\s*([^\d].*|)$/;
      if(!regex.test(str)) return false;
      let match = regex.exec(str)

      let num = match[1]
      let unit = match[2]

      let replace_regex = /(\.|\s)/
      unit = unit.replace(new RegExp(replace_regex, "g"), "").replace(/s$/, "").toLowerCase();

      return [num, unit]
  }
