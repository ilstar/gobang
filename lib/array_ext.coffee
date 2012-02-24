Array::remove = (element) ->
  index = @indexOf element
  @splice index, 1
  element
