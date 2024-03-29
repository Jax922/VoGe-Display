const countiesAlias = [
    {
        name: "United States",
        alias: ["USA", "United States of America", "America"]
    },
    {
        name: "United Kingdom",
        alias: ["UK", "England", "Britain"]
    }
]

const yearAlias = [
    // 1800s
    {"name": "1800", "alias": ["eighteen hundred"]},
    {"name": "1810", "alias": ["eighteen ten"]},
    {"name": "1820", "alias": ["eighteen twenty"]},
    {"name": "1830", "alias": ["eighteen thirty"]},
    {"name": "1840", "alias": ["eighteen forty"]},
    {"name": "1850", "alias": ["eighteen fifty"]},
    {"name": "1860", "alias": ["eighteen sixty"]},
    {"name": "1870", "alias": ["eighteen seventy"]},
    {"name": "1880", "alias": ["eighteen eighty"]},
    {"name": "1890", "alias": ["eighteen ninety"]},

    // 1900s
    {"name": "1900", "alias": ["nineteen hundred"]},
  {"name": "1910", "alias": ["nineteen ten"]},
  {"name": "1920", "alias": ["nineteen twenty"]},
  {"name": "1930", "alias": ["nineteen thirty"]},
  {"name": "1940", "alias": ["nineteen forty"]},
  {"name": "1950", "alias": ["nineteen fifty"]},
  {"name": "1951", "alias": ["nineteen fifty-one", "nineteen fifty one"]},
  {"name": "1952", "alias": ["nineteen fifty-two", "nineteen fifty two"]},
  {"name": "1953", "alias": ["nineteen fifty-three", "nineteen fifty three"]},
  {"name": "1954", "alias": ["nineteen fifty-four", "nineteen fifty four"]},
  {"name": "1955", "alias": ["nineteen fifty-five", "nineteen fifty five"]},
  {"name": "1956", "alias": ["nineteen fifty-six", "nineteen fifty six"]},
  {"name": "1957", "alias": ["nineteen fifty-seven", "nineteen fifty seven"]},
  {"name": "1958", "alias": ["nineteen fifty-eight", "nineteen fifty eight"]},
  {"name": "1959", "alias": ["nineteen fifty-nine", "nineteen fifty nine"]},
  {"name": "1960", "alias": ["nineteen sixty"]},
  {"name": "1961", "alias": ["nineteen sixty-one", "nineteen sixty one"]},
  {"name": "1962", "alias": ["nineteen sixty-two", "nineteen sixty two"]},
  {"name": "1963", "alias": ["nineteen sixty-three", "nineteen sixty three"]},
  {"name": "1964", "alias": ["nineteen sixty-four", "nineteen sixty four"]},
  {"name": "1965", "alias": ["nineteen sixty-five", "nineteen sixty five"]},
  {"name": "1966", "alias": ["nineteen sixty-six", "nineteen sixty six"]},
  {"name": "1967", "alias": ["nineteen sixty-seven", "nineteen sixty seven"]},
  {"name": "1968", "alias": ["nineteen sixty-eight", "nineteen sixty eight"]},
  {"name": "1969", "alias": ["nineteen sixty-nine", "nineteen sixty nine"]},
  {"name": "1970", "alias": ["nineteen seventy"]},
  {"name": "1971", "alias": ["nineteen seventy-one", "nineteen seventy one"]},
  {"name": "1972", "alias": ["nineteen seventy-two", "nineteen seventy two"]},
  {"name": "1973", "alias": ["nineteen seventy-three", "nineteen seventy three"]},
  {"name": "1974", "alias": ["nineteen seventy-four", "nineteen seventy four"]},
  {"name": "1975", "alias": ["nineteen seventy-five", "nineteen seventy five"]},
  {"name": "1976", "alias": ["nineteen seventy-six", "nineteen seventy six"]},
  {"name": "1977", "alias": ["nineteen seventy-seven", "nineteen seventy seven"]},
  {"name": "1978", "alias": ["nineteen seventy-eight", "nineteen seventy eight"]},
  {"name": "1979", "alias": ["nineteen seventy-nine", "nineteen seventy nine"]},
  {"name": "1980", "alias": ["nineteen eighty"]},
  {"name": "1981", "alias": ["nineteen eighty-one", "nineteen eighty one"]},
  {"name": "1982", "alias": ["nineteen eighty-two", "nineteen eighty two"]},
  {"name": "1983", "alias": ["nineteen eighty-three", "nineteen eighty three"]},
  {"name": "1984", "alias": ["nineteen eighty-four", "nineteen eighty four"]},
  {"name": "1985", "alias": ["nineteen eighty-five", "nineteen eighty five"]},
  {"name": "1986", "alias": ["nineteen eighty-six", "nineteen eighty six"]},
  {"name": "1987", "alias": ["nineteen eighty-seven", "nineteen eighty seven"]},
  {"name": "1988", "alias": ["nineteen eighty-eight", "nineteen eighty eight"]},
  {"name": "1989", "alias": ["nineteen eighty-nine", "nineteen eighty nine"]},
  {"name": "1990", "alias": ["nineteen ninety"]},
  {"name": "1991", "alias": ["nineteen ninety-one", "nineteen ninety one"]},
  {"name": "1992", "alias": ["nineteen ninety-two", "nineteen ninety two"]},
  {"name": "1993", "alias": ["nineteen ninety-three", "nineteen ninety three"]},
  {"name": "1994", "alias": ["nineteen ninety-four", "nineteen ninety four"]},
  {"name": "1995", "alias": ["nineteen ninety-five", "nineteen ninety five"]},
  {"name": "1996", "alias": ["nineteen ninety-six", "nineteen ninety six"]},
  {"name": "1997", "alias": ["nineteen ninety-seven", "nineteen ninety seven"]},
  {"name": "1998", "alias": ["nineteen ninety-eight", "nineteen ninety eight"]},
  {"name": "1999", "alias": ["nineteen ninety-nine", "nineteen ninety nine"]},

    // 2000s
    {"name": "2000", "alias": ["two thousand"]},
    {"name": "2001", "alias": ["two thousand and one", "two thousand one", "two thousand oh one", "two thousand o one"]},
    {"name": "2002", "alias": ["two thousand and two", "two thousand two", "two thousand oh two", "two thousand o two"]},
    {"name": "2003", "alias": ["two thousand and three", "two thousand o three", "two thousand three"]},
    {"name": "2004", "alias": ["two thousand and four", "two thousand four", "two thousand o four"]},
    {"name": "2005", "alias": ["two thousand and five", "two thousand five", "two thousand o five"]},
    {"name": "2006", "alias": ["two thousand and six", "two thousand six", "two thousand o six"]},
    {"name": "2007", "alias": ["two thousand and seven", "two thousand seven", "two thousand o seven"]},
    {"name": "2008", "alias": ["two thousand and eight", "two thousand eight", "two thousand o eight"]},
    {"name": "2009", "alias": ["two thousand and nine", "two thousand nine", "two thousand o nine"]},
    {"name": "2010", "alias": ["two thousand and ten", "two thousand ten"]},
    {"name": "2011", "alias": ["two thousand and eleven", "two thousand eleven"]},
    {"name": "2012", "alias": ["two thousand and twelve", "two thousand twelve"]},
    {"name": "2013", "alias": ["two thousand and thirteen", "two thousand thirteen"]},
    {"name": "2014", "alias": ["two thousand and fourteen", "two thousand fourteen"]},
    {"name": "2015", "alias": ["two thousand and fifteen", "two thousand fifteen", "last year"]},
]

export default {
    countiesAlias,
    yearAlias
}