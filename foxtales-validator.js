const validateFoxTale = (tale) => { 
  const output = new Array()
  try { 
    tale = JSON.parse(tale)
    if(typeof tale.title == "string") { 
      if(tale.title.length > 1 && tale.title.length < 26) { 
        output.push({ 
          success: "Title"
        })
      }
      else { 
        output.push({
          error: "Title should be between 2 and 25 characters long"
        })
      }
    }
    else { 
      output.push({
        error: "Title not found or not a valid string"
      })
    }
    if(typeof tale.author == "object" && Object.keys(tale.author).includes("fid","name","display_name")) { 
      output.push({
        success: "Author"
      })
    }
    else { 
      output.push({
        error: "Author not found or not a valid object containing fid, name, and display_name"
      })
    }
    if(typeof tale.pages == "object") { 
      const pageKeys = Object.keys(tale.pages); 
      if(pageKeys.includes("start") && pageKeys.length > 1) { 
        output.push({
          success: "Tale has a start page and at least one other page"
        })
        // page validation begins here 
        let pagesAreValid = true; 
        let hasWinCondition = false; 
        let foundGoTos = []; 
        for (const [key, page] of Object.entries(tale.pages)) { 
          if(key.match(/[a-z][a-z0-9]{2,25}/)==null) { 
            output.push({
              error: `Key "${key}" is invalid; must be a lowercase string, 1-25 characters`
            })
            pagesAreValid = false
          }
          if(typeof page.text === "string") { 
            if(page.text.length > 256) { 
              output.push({
                error: `The text of page "${key}" is too long: ${page.text.length} characters; must be 256 or fewer`
              })
              pagesAreValid = false
            }
            if(page.actions && page.condition) { 
              output.push({
                error: `Page "${key}" should not have both actions and a condition`
              })
              pagesAreValid = false
            }
            if(page.actions && Array.isArray(page.actions)) { 
              if(page.actions?.length < 1 || page.actions?.length > 3) { 
                output.push({
                  error: `The actions array of page "${key}" must contain 1-3 actions`
                })
                pagesAreValid = false; 
              }
              // time to validate actions 
              for(i in page.actions) { 
                const action = page.actions[i]; 
                if(typeof action.text === "string" && typeof action.goto === "string") { 
                  if(action.text.length < 1 || action.text.length > 16) { 
                    output.push({
                      error: `Page "${key}" action ${i+1} text must be 1-16 characters long`
                    })
                    pagesAreValid = false; 
                  }
                  if(!pageKeys.includes(action.goto)) { 
                    output.push({
                      error: `Action ${i+1} of page ${key} goes to a non-existent page`
                    })
                    pagesAreValid = false; 
                  }
                  foundGoTos.push(action.goto); 
                }
                else { 
                  output.push({
                    error: `Page "${key}" contains an invalid action; must have a text and goto`
                  })
                  pagesAreValid = false; 
                }
              }
            }
            else if(page.action) { 
              output.push({
                error: `Page "${key} has an invalid set of actions, must be an array`
              })
              pagesAreValid = false
            }
            if(page.condition && page.condition !== "win" && page.condition !== "lose") { 
              output.push({
                error: `Page "${key} has an invalid condition, must be "win" or "lose"`
              })
              pagesAreValid = false
            }
          }
          else { 
            output.push({ 
              error: `Page "${key}" appears invalid, must have text string and an actions array or condition string`
            })
            pagesAreValid = false; 
          }
          if(page.condition === "win") {
            hasWinCondition = true; 
          }
        }
        if(!hasWinCondition) { 
          output.push({
            error: 'Win condition not found; at least 1 page must have condition: "win"'
          })
          pagesAreValid = false; 
        }
        // let's look at pageKeys and foundGoTos
        foundGoTos.push("start"); 
        const orphanedPages = pageKeys.filter(x => !foundGoTos.includes(x)); 
        if(orphanedPages.length > 0) { 
          output.push({
            error: `The following pages are unreachable: "${orphanedPages.join('", "')}"`
          })
        }
        if(pagesAreValid) { 
          output.push({
            success: "All pages are valid; game should be playable!"
          })
        }
      }
      else { 
        output.push({
          error: "You must have at least 2 pages and one must be labeled 'start'"
        })
      }
    }
    else { 
      output.push({
        error: "Pages not found"
      })
    }
  } catch(e) { 
    output.push({
      error: "Invalid JSON"
    })
  }
  return output; 
}