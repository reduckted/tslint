function SimpleFormatter () {

}
SimpleFormatter.prototype = Object.create({
    name: "simple",
    getName: function () {
        return this.name;
    },
    format: function (context) {
        var output = "";
        for (var i = 0; i < context.failures.length; ++i) {
            var failure = context.failures[i];
            var fileName = failure.getFileName();

            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var line = lineAndCharacter.line;
            var character = lineAndCharacter.character;

            output += "[" + (line + 1) + ", " + (character + 1) + "]" + fileName + "\n";
        }
        return output;
    },
});

module.exports = {
    Formatter: SimpleFormatter,
};
