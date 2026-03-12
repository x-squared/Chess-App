//'use strict';

// Global namespace
var CHESS = CHESS || {};

;
var CHESS = CHESS || {};

CHESS.env = 'development';

CHESS.assert = (CHESS.env === 'production'
    ? function () {}
    : function (test, message) {
        if (!test) {
            throw new Error('Assertion failed: ' + message);
        }
    }
);

CHESS.assertClass = (CHESS.env === 'production'
    ? function () {}
    : function (param, constructor) {
        if (typeof param !== 'object') {
            throw new Error(
                'Assertion failed:\nClass ' + constructor.name +
                ' expected, but ' + (typeof param) + ' found.'
            );
        }
        if (param.constructor !== constructor) {
            throw new Error(
                'Assertion failed:\nClass ' + constructor.name +
                ' expected, but ' + param.constructor.name + ' found.'
            );
        }

    }
);

CHESS.assertPattern = (CHESS.env === 'production'
    ? function () {}
    : function (param, pattern) {
        this.assertString(param);
        if (!pattern.test(param)) {
            throw new Error('Expected pattern:\n\t' + pattern + '\n  Actual:\n\t' + param);
        }
    }
);

CHESS.assertNumber = (CHESS.env === 'production'
    ? function () {}
    : function (param) {
        this.assertType(param, 'number');
    }
);

CHESS.assertNumberRange = (CHESS.env === 'production'
    ? function () {}
    : function (param, low, high) {
        this.assertNumber(param);
        this.assertNumber(low);
        this.assertNumber(high);
        if (param < low || param > high) {
            throw new Error('Number:\n\t' + param + '\n  Not in range:\n\t' + low + ' ... ' + high);
        }
    }
);

CHESS.assertString = (CHESS.env === 'production'
    ? function () {}
    : function (param) {
        this.assertType(param, 'string');
    }
);

CHESS.assertStringLength = (CHESS.env === 'production'
    ? function () {}
    : function (param, length) {
        this.assertString(param);
        this.assertNumber(length);
        if (param.length !== length) {
            throw new Error('String:\n\t' + param + '\n  Expected length:\n\t' + length + '\n  Actual length:\n\t' + param.length);
        }
    }
);

CHESS.assertType = (CHESS.env === 'production'
    ? function () {}
    : function (param, expectedType) {
        var actualType = typeof param;
        if (expectedType !== actualType) {
            throw new Error('Expected type:\n\t' + expectedType + '\n  Actual type:\n\t' + actualType);
        }
    }
);

;
var CHESS = CHESS || {};

CHESS.Square = function ($) {

    /**
     * @class
     * @param {string} anSquare - A square in algebraic notation.
     */
    function Square (anSquare) {
        var that = this,
            name = '';

        /**
         * @param {number} fileCount - Number of files to add (or subtract if negative)
         * @return {boolean}
         */
        this.addFile = function (fileCount) {
            var newFile,
                success;

            if (typeof fileCount !== 'number' || isNaN(fileCount)) {
                return false;
            }

            if (Math.abs(fileCount > 7)) {
                return false;
            }

            if (this.isNull()) {
                return false;
            }

            newFile = addNumberToCharacter(fileCount, this.getFile());
            success = setSquare(newFile + this.getRank());

            return success;
        };

        var addNumberToCharacter = function (number, character) {
            var currentFileNumber,
                newFileNumber,
                fileCharacter;

            $.assertNumberRange(number, -7, 7);
            $.assertStringLength(character, 1);

            currentFileNumber = convertCharacterToNumber(character);
            newFileNumber = currentFileNumber + number;
            fileCharacter = convertNumberToCharacter(newFileNumber)

            return fileCharacter;
        };

        var isValidFileNumber = function (fileNumber) {
            $.assertNumber(fileNumber);
            return (fileNumber >= 1 && fileNumber <=8);
        };

        var setSquare = function (anSquare) {
            $.assertString(anSquare);
            if (invalidAlgebraicNotation(anSquare)) {
                return false;
            }
            name = anSquare;
            return true;
        };

        var invalidAlgebraicNotation = function (anSquare) {
            $.assertString(anSquare);
            return !(/^[a-h][1-8]$/.test(anSquare));
        };

        var convertNumberToCharacter = function (number) {
            $.assertNumber(number);
            return String.fromCharCode(number + 96);
        };

        var convertCharacterToNumber = function (character) {
            $.assertString(character);
            $.assertPattern(character, /^[a-h]$/);
            return (character.charCodeAt(0) - 96);
        };

        /**
         * @param {number} i - Number of ranks to add (or subtract if negative)
         * @return {boolean}
         */
        this.addRank = function (i) {
            var newSquare = this.getFile() + (parseInt(this.getRank(), 10) + i);
            return setSquare(newSquare);
        };

        /**
         * @returns {Square}
         */
        this.clone = function () {
            return new $.Square(this.getName());
        };

        /**
         * Count the number of files between two squares (absolute value).
         * @param {Square} square
         * @return {number}
         */
        this.compareFile = function (square) {
            return Math.abs(this.diffFile(square));
        }

        /**
         * Count the number of ranks between two squares (absolute value).
         * @param {Square} square
         * @return {number}
         */
        this.compareRank = function (square) {
            return Math.abs(this.diffRank(square));
        }

        /**
         * Count the number of files between two squares (positive or negative).
         * @param {Square} square
         * @return {number}
         */
        this.diffFile = function (square) {
            if (square === undefined) {
                return 0;
            }
            return (convertCharacterToNumber(square.getFile()) - convertCharacterToNumber(this.getFile()));
        }

        /**
         * Count the number of ranks between two squares (positive or negative).
         * @param {Square} square
         * @return {number}
         */
        this.diffRank = function (square) {
            if (square === undefined) {
                return 0;
            }
            return (parseInt(square.getRank(), 10) - parseInt(this.getRank(), 10));
        }

        /**
         * @param {Square} square
         * @returns {boolean}
         */
        this.equals = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            return (name === square.getName());
        };

        /**
         * Extract the file letter from a square.
         * @return {string}
         */
        this.getFile = function () {
            return name.substr(0, 1).toLowerCase();
        };

        /**
         * return {string}
         */
        this.getName = function () {
            return name;
        };

        /**
         * Extract the rank from the square.
         * @return {string}
         */
        this.getRank = function () {
            return name.substr(1, 1);
        };

        var isASquare = function (square) {
            if (typeof square !== 'object') {
                return false;
            }
            return (square.constructor === that.constructor);
        };

        /**
         * Determine if another square is on the same diagonal.
         * @param {Square} square
         * @return {boolean}
         */
        this.isBishopMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.compareRank(square) === this.compareFile(square));
        };

        /**
         * Determine if another square is on a neighboring square.
         * @param {Square} square
         * @return {boolean}
         */
        this.isKingMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.compareRank(square) < 2 && this.compareFile(square) < 2);
        };

        /**
         * Determine if another square is a knight move away.
         * @param {Square} square
         * @return {boolean}
         */
        this.isKnightMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.compareRank(square) === 1 && this.compareFile(square) === 2) ||
                (this.compareRank(square) === 2 && this.compareFile(square) === 1);
        };

        /**
         * returns {boolean}
         */
        this.isNull = function () {
            return (name === '');
        };

        /**
         * Determine if another square is the same diagonal, rank, or file.
         * @param {Square} square
         * @return boolean
         */
        this.isQueenMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.isRookMove(square) || this.isBishopMove(square));
        };

        /**
         * Determine if another square is the same rank or file.
         * @param {Square} square
         * @return boolean
         */
        this.isRookMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.isSameRank(square) || this.isSameFile(square));
        };

        /**
         * Determine if another square is the file.
         * @param {Square} square
         * @return {boolean}
         */
        this.isSameFile = function (square) {
            if (square === undefined) {
                return false;
            }
            return (this.getFile() === square.getFile());
        };

        /**
         * Determine if another square is the same rank.
         * @param {Square} square
         * @return {boolean}
         */
        this.isSameRank = function (square) {
            if (square === undefined) {
                return false;
            }
            return (this.getRank() === square.getRank());
        };

        /**
         * Change the current file.
         * @param {string} file - A single character representing
         * the letter of the new file.
         * @return {boolean}
         */
        this.setFile = function (file) {
            var newSquare;
            if (file === undefined) {
                return false;
            }
            newSquare = file + this.getRank();
            return setSquare(newSquare);
        };

        /**
         * Change the current rank.
         * @param {string} rank - A single character representing
         * the number of the new rank.
         * @return {boolean}
         */
        this.setRank = function (rank) {
            var newSquare;
            if (rank === undefined) {
                return false;
            }
            newSquare = this.getFile() + rank;
            return setSquare(newSquare);
        };

        /**
         * Advance one step toward a new square.
         * @param {Square} square
         * @return {boolean}
         */
        this.stepTo = function (square) {
            var fileDiff,
                rankDiff;

            if (!this.isQueenMove(square)) {
                return false;
            }

            fileDiff = this.diffFile(square);
            fileDiff = Math.abs(fileDiff) / fileDiff;
            this.addFile(fileDiff);

            rankDiff = this.diffRank(square);
            rankDiff = Math.abs(rankDiff) / rankDiff;
            this.addRank(rankDiff);

            return true;
        };

        /**
         * @returns {string}
         */
        this.toString = function () {
            return name;
        };

        if (typeof anSquare === 'string') {
            setSquare(anSquare);
        }
    }

    Square.getAllSquares = function () {
        var i,
            j
            squareList = [];

        for (i = 1; i <= 8; i++) {
            for (j = 1; j <= 8; j++) {
                square = new Square(String.fromCharCode(i + 96) + j);
                squareList.push(square);
            }
        }

        return squareList;
    };

    return Square;

}(CHESS);

;
var CHESS = CHESS || {};

CHESS.Move = function ($) {

    /**
     * @constructor
     * @param {Square} start
     * @param {Square} end
     */
    function Move (start, end) {
        var startSquare,
            endSquare;

        this.getEndSquare = function () {
            return endSquare;
        };

        this.getStartSquare = function () {
            return startSquare;
        };

        var setMove = function (start, end) {
            startSquare = start.clone();
            endSquare = end.clone();
        };

        setMove(start, end);
    }

    return Move;

}(CHESS);

;
var CHESS = CHESS || {};

CHESS.Piece = function ($) {

    /**
     * @class
     * @param {string} pieceAbbrev - A two-character abbreviated piece.
     */
    function Piece (pieceAbbrev) {
        var that = this,
            type = '',
            color = '';

        /**
         * @param {Piece} piece
         * @returns {boolean}
         */
        this.equals = function (piece) {
            if (!isAPiece(piece)) {
                return false;
            }
            return (
                this.getType() === piece.getType()
                && this.getColor() === piece.getColor()
            );
        };

        var isAPiece = function (piece) {
            if (typeof piece !== 'object') {
                return false;
            }
            return (piece.constructor === that.constructor);
        };

        /**
         * @returns {string} 
         */
        this.getColor = function () {
            return color;
        };

        /**
         * @returns {string} 
         */
        this.getType = function () {
            return type;
        };

        /**
         * @returns {boolean} 
         */
        this.isBishop = function () {
            return (type === 'b');
        };

        /**
         * @returns {boolean} 
         */
        this.isBlack = function () {
            return (color === 'b');
        };

        /**
         * @returns {boolean} 
         */
        this.isColor = function (c) {
            return (color === c);
        };

        /**
         * @returns {boolean} 
         */
        this.isKing = function () {
            return (type === 'k');
        };

        /**
         * @returns {boolean} 
         */
        this.isKnight = function () {
            return (type === 'n');
        };

        /**
         * @returns {boolean} 
         */
        this.isNull = function () {
            return (type === false);
        };

        /**
         * @returns {boolean} 
         */
        this.isPawn = function () {
            return (type === 'p');
        };

        /**
         * @returns {boolean} 
         */
        this.isQueen = function () {
            return (type === 'q');
        };

        /**
         * @returns {boolean} 
         */
        this.isRook = function () {
            return (type === 'r');
        };

        /**
         * @returns {boolean} 
         */
        this.isWhite = function () {
            return (color === 'w');
        };

        /**
         * @returns {string} 
         */
        this.toString = function () {
            return (color && type ? color + type : '');
        };

        var getTypeFromAbbrev = function (pieceAbbrev) {
            if (!/^[wb][kqrbnp]$/.test(pieceAbbrev)) {
                return false;
            }
            return pieceAbbrev.substr(1, 1);
        };

        var getColorFromAbbrev = function (pieceAbbrev) {
            if (!/^[wb][kqrbnp]$/.test(pieceAbbrev)) {
                return false;
            }
            return pieceAbbrev.substr(0, 1);
        };

        type = getTypeFromAbbrev(pieceAbbrev);
        color = getColorFromAbbrev(pieceAbbrev);
    }

    return Piece;

}(CHESS);

;
var CHESS = CHESS || {};

CHESS.Position = function ($) {

    /**
     * @class
     * @param {string} fen
     */
    function Position (fen) {
        var castleWK = false,
            castleWQ = false,
            castleBK = false,
            castleBQ = false,
            colorToMove = '',
            enPassant = '-',
            positionArray = [];

        /**
         * @returns {boolean}
         */
        this.canBlackCastleKingside = function () {
            return castleBK;
        };

        /**
         * @returns {boolean}
         */
        this.canBlackCastleQueenside = function () {
            return castleBQ;
        };

        /**
         * @returns {boolean}
         */
        this.canWhiteCastleKingside = function () {
            return castleWK;
        };

        /**
         * @returns {boolean}
         */
        this.canWhiteCastleQueenside = function () {
            return castleWQ;
        };

        /**
         * @returns {Position}
         */
        this.clone = function () {
            return new $.Position(this.getFen());
        };

        /**
         * @param {string} pieceAbbrev
         * @returns {Square[]}
         */
        this.findPiece = function (pieceAbbrev) {
            var squares = [];
            for (i = 0; i < positionArray.length; i++) {
                for (j = 0; j < positionArray[i].length; j++) {
                    if (positionArray[i][j] === pieceAbbrev) {
                        squares.push(new $.Square(getSquareName(i, j)));
                    }
                }
            }
            return squares;
        };

        /**
         * @returns {string} 
         */
        this.getColorToMove = function () {
            return colorToMove;
        };

        /**
         * @returns {string} 
         */
        this.getColorNotToMove = function () {
            return (colorToMove === 'w' ? 'b' : 'w');
        };

        var getEmptyPositionArray = function () {
            return [
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-']
            ];
        };

        /**
         * @returns {Square}
         */
        this.getEnPassantSquare = function () {
            return new $.Square(enPassant);
        };

        /**
         * @returns {string}
         */
        this.getFen = function () {
            return [
                dataToFenPosition(),
                colorToMove,
                dataToFenCastling(),
                enPassant,
                '0 1'
            ].join(' ');
        };

        var getSquareName = function (y, x) {
            var file = String.fromCharCode(x + 97),
                rank = 8 - y;
            return (file + rank);
        };

        var dataToFenCastling = function () {
            var castling = '';
            if (castleWK) {
                castling += 'K';
            }
            if (castleWQ) {
                castling += 'Q';
            }
            if (castleBK) {
                castling += 'k';
            }
            if (castleBQ) {
                castling += 'q';
            }
            return (castling === '' ? '-' : castling);
        };

        var dataToFenPosition = function () {
            var rowNumber,
                rows = [];

            for (rowNumber = 0; rowNumber < positionArray.length; rowNumber += 1) {
                rows.push(dataToFenPositionRow(rowNumber));
            }

            return rows.join('/');
        };

        var dataToFenPositionRow = function (rowNumber) {
            var columnNumber,
                piece,
                row = '';

            for (columnNumber = 0; columnNumber < positionArray[rowNumber].length; columnNumber += 1) {
                piece = dataToFenPiece(positionArray[rowNumber][columnNumber]);
                row = updateOrAppendToFenPositionRow(row, piece);
            }

            return row;
        };

        var updateOrAppendToFenPositionRow = function (row, piece) {
            var emptySquares = 0;

            if (piece === '') {
                if (row.length > 0) {
                    emptySquares = row.slice(-1);
                    if (/^[1-7]$/.test(emptySquares)) {
                        emptySquares = parseInt(emptySquares, 10);
                    } else {
                        emptySquares = 0;
                    }
                    if (emptySquares > 0) {
                        row = row.slice(0, row.length - 1);
                    }
                }
                row += (++emptySquares + '');
            } else {
                row += piece;
            }

            return row;
        };

        var dataToFenPiece = function (dataPiece) {
            var color = dataPiece.substr(0, 1),
                fenPiece = dataPiece.substr(1, 1);
            if (color === 'w') {
                fenPiece = fenPiece.toUpperCase();
            }
            return fenPiece;
        };

        var getFenSegmentCastling = function (fen) {
            return fen.split(' ')[2];
        };

        var getFenSegmentColorToMove = function (fen) {
            return fen.split(' ')[1];
        };

        var getFenSegmentEnPassant = function (fen) {
            return fen.split(' ')[3];
        };

        var getFenSegmentPosition = function (fen) {
            return fen.split(' ')[0];
        };

        /**
         * @param {Square} square
         * @returns {Piece}
         */
        this.getPiece = function (y, x) {
            // TODO: Replace y, x params with square
            if (y.hasOwnProperty('getName') && /^[a-h][1-8]$/.test(y.getName())) {
                var sq = y;
                x = sq.getName().substr(0, 1).toLowerCase();
                y = sq.getName().substr(1, 1);
                x = x.charCodeAt(0) - 97;
                y = 8 - y;
            }
            if (y === false || y < 0 || x < 0 || y >= positionArray.length || x >= positionArray[y].length) {
                return new $.Piece();
            }
            return new $.Piece(positionArray[y][x]);
        };

        /**
         * @returns {boolean} 
         */
        this.isBlackToMove = function () {
            return (colorToMove === 'b');
        };

        /**
         * @returns {boolean} 
         */
        this.isWhiteToMove = function () {
            return (colorToMove === 'w');
        };

        /**
         * @param {boolean} canCastle
         */
        this.setBlackCastleKingside = function (canCastle) {
            castleBK = (canCastle === true);
        };

        /**
         * @param {boolean} canCastle
         */
        this.setBlackCastleQueenside = function (canCastle) {
            castleBQ = (canCastle === true);
        };

        this.setBlackToMove = function () {
            colorToMove = 'b';
        };

        var setData = function (fen) {
            var castling;

            enPassant = getFenSegmentEnPassant(fen);
            colorToMove = getFenSegmentColorToMove(fen);

            castling = getFenSegmentCastling(fen);
            castleWK = (castling.indexOf('K') >= 0);
            castleWQ = (castling.indexOf('Q') >= 0);
            castleBK = (castling.indexOf('k') >= 0);
            castleBQ = (castling.indexOf('q') >= 0);
        };

        /**
         * @param {Square} square
         */
        this.setEnPassantSquare = function (square) {
            if (square !== undefined && square.hasOwnProperty('getName') && /^[a-h][36]$/.test(square.getName())) {
                enPassant = square.getName();
            } else {
                enPassant = '-';
            }
        };

        /**
         * @param {Square} square
         * @param {string} pieceAbbrev - Color [w|b] and type [p|r|n|b|k|q] (with file letter for pawns).
         */
        this.setPiece = function (y, x, pieceAbbrev) {
            // TODO: Replace y, x params with square
            if (y.hasOwnProperty('getName') && /^[a-h][1-8]$/.test(y.getName())) {
                var sq = y;
                x = sq.getName().substr(0, 1).toLowerCase();
                y = sq.getName().substr(1, 1);
                x = x.charCodeAt(0) - 97;
                y = 8 - y;
            }

            positionArray[y][x] = pieceAbbrev;
        };

        var setPieces = function (fen) {
            var alphaConversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
                i = 0,
                j = 0,
                k = 0,
                fewRows = [],
                file,
                rowItem = '',
                startingIndex = 0;

            positionArray = getEmptyPositionArray();

            if (fen === undefined || typeof fen !== 'string' && !(fen instanceof string)) {
                return;
            }

            fenRows = getFenSegmentPosition(fen).split('/');

            for (i = 0; i < fenRows.length; i += 1) {
                for (j = 0; j < fenRows[i].length; j += 1) {
                    rowItem = fenRows[i].charAt(j);
                    // Get starting index
                    for (k = 0; k < positionArray[i].length; k += 1) {
                        if (positionArray[i][k] === '-') {
                            startingIndex = k;
                            k = positionArray[i].length; // break
                        }
                    }
                    if (/^[0-9]$/.test(rowItem)) {
                        // Empty square(s)
                        for (k = 0; k < parseInt(rowItem, 10); k += 1) {
                            positionArray[i][k + startingIndex] = '';
                        }
                    } else {
                        file = alphaConversion[startingIndex];
                        positionArray[i][startingIndex] = fenToDataPiece(rowItem, file);
                    }
                }
            }
        };

        var fenToDataPiece = function (piece, file) {
            var color = 'w'
                file = '';

            if (/^[kqrbnp]$/.test(piece)) {
                color = 'b';
            }
            piece = piece.toLowerCase();
            if (piece === 'p') {
                // TODO Remove file
                piece += file;
            }

            return color + piece;
        };

        var setPosition = function (fen) {
            if (!validateFen(fen)) {
                return false;
            }
            setData(fen);
            setPieces(fen);
        };

        /**
         * @param {boolean} canCastle
         */
        this.setWhiteCastleKingside = function (canCastle) {
            castleWK = (canCastle === true);
        };

        /**
         * @param {boolean} canCastle
         */
        this.setWhiteCastleQueenside = function (canCastle) {
            castleWQ = (canCastle === true);
        };

        this.setWhiteToMove = function () {
            colorToMove = 'w';
        };

        var validateFen = function (fen) {
            return /\s+([wbWB])\s+([-kqKQ]+)\s+([-\w]{1,2})\s+(\d+)\s+(\d+)\s*$/.test(fen);
        };

        setPosition(fen);
    }

    return Position;

}(CHESS);

;
var CHESS = CHESS || {};

CHESS.BoardTraveler = function ($) {

    /**
     * @class
     * @param {Position} position - A position to travel.
     * @param {Square} fromSquare - A square to travel from.
     */
    function BoardTraveler (position, fromSquare) {
        this.travelBoardAs = function (pieceDefinition, action) {
            var adjust,
                i,
                j,
                newSquare,
                piece,
                moveMap = pieceDefinition.moveMap,
                distance = pieceDefinition.distance;

            for (i = 0; i < moveMap.length; i++) {
                adjust = moveMap[i];
                for (j = 1; j <= distance; j++) {
                    newSquare = fromSquare.clone();
                    if (newSquare.addRank(adjust.rank * j) && newSquare.addFile(adjust.file * j)) {
                        // Call the user-defined action
                        action(newSquare);
                        // Don't look beyond the first piece
                        piece = position.getPiece(newSquare);
                        if (!piece.isNull()) {
                            break;
                        }
                    }
                }
            }
        };
    }

    BoardTraveler.BISHOP = {
        distance: 7,
        moveMap: [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };
    BoardTraveler.ROOK = {
        distance: 7,
        moveMap: [
            {'rank': 1, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1}
        ]
    };
    BoardTraveler.QUEEN = {
        distance: 7,
        moveMap: [
            {'rank': 1, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1},
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };
    // TODO Create a KING_CASTLE definition
    // Can't include it here because kings
    // don't move and capture exactly the same
    BoardTraveler.KING = {
        distance: 1,
        moveMap: [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': 0},
            {'rank': 1, 'file': -1},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': 0},
            {'rank': -1, 'file': -1}
        ]
    };
    BoardTraveler.KNIGHT = {
        distance: 1,
        moveMap: [
            {'rank': 1, 'file': 2},
            {'rank': 1, 'file': -2},
            {'rank': 2, 'file': 1},
            {'rank': 2, 'file': -1},
            {'rank': -1, 'file': 2},
            {'rank': -1, 'file': -2},
            {'rank': -2, 'file': 1},
            {'rank': -2, 'file': -1}
        ]
    };
    BoardTraveler.WHITE_PAWN = {
        distance: 1,
        moveMap: [
            {'rank': 2, 'file': 0},
            {'rank': 1, 'file': 0},
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1}
        ]
    };
    BoardTraveler.BLACK_PAWN = {
        distance: 1,
        moveMap: [
            {'rank': -2, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };
    BoardTraveler.WHITE_PAWN_CAPTURE = {
        distance: 1,
        moveMap: [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1}
        ]
    };
    BoardTraveler.BLACK_PAWN_CAPTURE = {
        distance: 1,
        moveMap: [
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };

    return BoardTraveler;

}(CHESS);

;
var CHESS = CHESS || {};

CHESS.BoardMover = function ($) {

    /**
     * @class
     * @param {Position} position - An initial position for moving pieces.
     */
    function BoardMover (position) {
        this.move = function (move, promotion) {
            var capturedPiece,
                piece,
                startSquare = move.getStartSquare().clone(),
                endSquare = move.getEndSquare().clone();

            if (!isMoveLegal(move)) {
                return false;
            }

            capturedPiece = position.getPiece(endSquare);
            piece = position.getPiece(startSquare);

            movePiece(startSquare, endSquare, piece);

            if (piece.isPawn()) {
                if (startSquare.compareRank(endSquare) === 2) {
                    setNewEnPassantSquare(startSquare);
                } else if (endSquare.getRank() === '1' || endSquare.getRank() === '8') {
                    promotePawn(endSquare, promotion || 'Q');
                } else if (!startSquare.isSameFile(endSquare) && capturedPiece.isNull()) {
                    removeEnPassantPiece(endSquare);
                }
            }

            if (piece.isKing()) {
                disableKingsideCastling(piece);
                disableQueensideCastling(piece);

                if (piece.isKing() && startSquare.getFile() === 'e') {
                    if (endSquare.getFile() === 'g') {
                        castleKingsideWithRook(startSquare);
                    } else if (endSquare.getFile() === 'c') {
                        castleQueensideWithRook(startSquare);
                    }
                }
            }

            if (piece.isRook()) {
                if (startSquare.getName() === 'h1' || startSquare.getName() === 'h8') {
                    disableKingsideCastling(piece);
                } else if (startSquare.getName() === 'a1' || startSquare.getName() === 'a8') {
                    disableQueensideCastling(piece);
                }
            }

            if (capturedPiece.isRook()) {
                if (endSquare.getName() === 'a1' || endSquare.getName() === 'a8') {
                    disableQueensideCastling(capturedPiece);
                } else if (endSquare.getName() === 'h1' || endSquare.getName() === 'h8') {
                    disableKingsideCastling(capturedPiece);
                }
            }

            if (position.isWhiteToMove()) {
                position.setBlackToMove();
            } else {
                position.setWhiteToMove();
            }

            return true;
        };

        var isMoveLegal = function (move) {
            return $.Engine.isLegal(position, move);
        };

        var movePiece = function (startSquare, endSquare, piece) {
            position.setPiece(endSquare, '', piece.toString());
            position.setPiece(startSquare, '', '');
            position.setEnPassantSquare();
        };

        var promotePawn = function (endSquare, promotion) {
            var color = (endSquare.getRank() === '8' ? 'w' : 'b');

            if (/^[QRBN]$/.test(promotion)) {
                promotion = promotion.toLowerCase();
                position.setPiece(endSquare, '', color + promotion);
            } else {
                // throw error
            }
        };

        var setNewEnPassantSquare = function (startSquare) {
            var newEnPassantSquare = startSquare.clone(),
                pawnDirection = (startSquare.getRank() === '2' ? 1 : -1);
            newEnPassantSquare.addRank(pawnDirection);
            position.setEnPassantSquare(newEnPassantSquare);
        };

        var removeEnPassantPiece = function (endSquare) {
            var newEnPassantSquare = endSquare.clone(),
                pawnDirection = (endSquare.getRank() === '6' ? 1 : -1);
            newEnPassantSquare.addRank(-pawnDirection);
            position.setPiece(newEnPassantSquare, '', '');
        };

        var castleKingsideWithRook = function (startSquare) {
            var rank = startSquare.getRank(),
                piece = position.getPiece(new $.Square('h' + rank));
            position.setPiece(new $.Square('f' + rank), '', piece.toString());
            position.setPiece(new $.Square('h' + rank), '', '');
        };

        var castleQueensideWithRook = function (startSquare) {
            var rank = startSquare.getRank(),
                piece = position.getPiece(new $.Square('a' + rank));
            position.setPiece(new $.Square('d' + rank), '', piece.toString());
            position.setPiece(new $.Square('a' + rank), '', '');
        };

        var disableKingsideCastling = function (piece) {
            if (piece.isWhite()) {
                position.setWhiteCastleKingside(false);
            } else {
                position.setBlackCastleKingside(false);
            }
        };

        var disableQueensideCastling = function (piece) {
            if (piece.isWhite()) {
                position.setWhiteCastleQueenside(false);
            } else {
                position.setBlackCastleQueenside(false);
            }
        };
    }

    return BoardMover;

}(CHESS);

;
var CHESS = CHESS || {};

/**
 * Utility library
 */
CHESS.Engine = function ($) {

$.Engine = {};

$.Engine.gameIsOver = function (position) {
    return this.getLegalMoves(position).length === 0;
};

$.Engine.isStalemate = function (position) {
    return !this.isCheck(position) && this.getLegalMoves(position).length === 0;
};

$.Engine.getLegalMoves = function (position) {
    var i,
        moveList = [],
        piece,
        square,
        squareMoveList,
        allSquares;

    allSquares = $.Square.getAllSquares();

    // Get potential moves
    for (i = 0; i < allSquares.length; i++) {
        square = allSquares[i];
        piece = position.getPiece(square);
        if (!piece.isColor(position.getColorToMove())) {
            continue;
        }
        squareMoveList = this.getPotentialMovesFromSquare(position, square);
        moveList.push.apply(moveList, squareMoveList);
    }

    // Remove illegal candidates
    for (i = 0; i < moveList.length; i++) {
        var startSquare = new $.Square(moveList[i].split('-')[0]);
        var endSquare = new $.Square(moveList[i].split('-')[1]);
        var move = new $.Move(startSquare, endSquare);
        if (!this.isLegal(position, move)) {
            moveList.splice(i, 1);
            i--;
        }
    }

    return moveList;
};

$.Engine.getAttackers = function (position, square, pieceColor) {
    var attackers = [];

    attackers = attackers.concat(
        this.getBishopAttackers(position, square, pieceColor),
        this.getKingAttackers(position, square, pieceColor),
        this.getKnightAttackers(position, square, pieceColor),
        this.getPawnAttackers(position, square, pieceColor),
        this.getQueenAttackers(position, square, pieceColor),
        this.getRookAttackers(position, square, pieceColor)
    );

    return attackers;
};

$.Engine.getPotentialMovesFromSquare = function (position, square) {
    var moveList = [],
        piece,
        pieceMoves;

    piece = position.getPiece(square);

    if (piece.isPawn()) {
        pieceMoves = $.Engine.getPawnPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isKing()) {
        pieceMoves = $.Engine.getKingPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isQueen()) {
        pieceMoves = $.Engine.getQueenPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isRook()) {
        pieceMoves = $.Engine.getRookPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isBishop()) {
        pieceMoves = $.Engine.getBishopPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isKnight()) {
        pieceMoves = $.Engine.getKnightPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }

    return moveList;
};

$.Engine.getBishopAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.BISHOP, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isBishop() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getBishopPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.BISHOP, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getKingAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KING, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isKing() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getKingPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KING, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getKnightAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KNIGHT, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isKnight() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getKnightPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KNIGHT, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getPawnAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare),
        pieceDefinition = (pieceColor === 'w'
            ? CHESS.BoardTraveler.BLACK_PAWN_CAPTURE
            : CHESS.BoardTraveler.WHITE_PAWN_CAPTURE
        );

    boardTraveler.travelBoardAs(pieceDefinition, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isPawn() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getPawnPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);
        pieceDefinition = (position.isWhiteToMove()
            ? CHESS.BoardTraveler.WHITE_PAWN
            : CHESS.BoardTraveler.BLACK_PAWN
        );

    boardTraveler.travelBoardAs(pieceDefinition, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getQueenAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.QUEEN, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isQueen() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getQueenPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.QUEEN, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getRookAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.ROOK, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isRook() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getRookPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.ROOK, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.isLegal = function (position, move) {
    var newPiece,
        piece,
        startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        testPosition;

    if (startSquare.isNull() || endSquare.isNull()) {
        return false;
    }

    piece = position.getPiece(startSquare),
    newPiece = position.getPiece(endSquare);
 
    if (!piece.isColor(position.getColorToMove())) {
        return false;
    }

    if (!newPiece.isNull() && newPiece.isColor(piece.getColor())) {
        return false;
    }

    if (piece.isKing() && !this.isLegalKingMove(position, move)) {
        return false;
    }

    if (piece.isPawn() && !this.isLegalPawnMove(position, move)) {
        return false;
    }

    if (piece.isKnight() && !startSquare.isKnightMove(endSquare)) {
        return false;
    }

    if (piece.isRook() && !startSquare.isRookMove(endSquare)) {
        return false;
    }

    if (piece.isBishop() && !startSquare.isBishopMove(endSquare)) {
        return false;
    }

    if (piece.isQueen() && !startSquare.isQueenMove(endSquare)) {
        return false;
    }

    if (piece.isQueen() || piece.isBishop() || piece.isRook()) {
        if (!this.isClearPath(position, move)) {
            return false;
        }
    }

    testPosition = this.testMove(position, move);
    if (this.isCheck(testPosition)) {
        return false;
    }

    return true;
};

$.Engine.isClearPath = function (position, move) {
    var startSquare = move.getStartSquare().clone(),
        endSquare = move.getEndSquare();

    while (startSquare.stepTo(endSquare)) {
        if (startSquare.equals(endSquare)) {
            break;
        }
        if (!position.getPiece(startSquare).isNull()) {
            return false;
        }
    }

    return true;
};

$.Engine.isInsufficientMaterial = function (position) {
    // For now, this does not include:
    // * Perpetual check
    // * Perpetual pursuit
    // * Blockade
    // * Fortress
    // * Drawing balance of forces

    var i,
        fen = position.getFen().split(' ')[0];

    if (/Q/.test(fen)) {
        return false;
    }
    if (/R/.test(fen)) {
        return false;
    }
    if (/B/.test(fen) && /N/.test(fen)) {
        return false;
    }
    if (/P/.test(fen)) {
        return false;
    }
    i = fen.indexOf('B');
    if (i !== -1 && fen.indexOf('B', i + 1) !== -1) {
        return false;
    }
    if (/q/.test(fen)) {
        return false;
    }
    if (/r/.test(fen)) {
        return false;
    }
    if (/b/.test(fen) && /n/.test(fen)) {
        return false;
    }
    if (/p/.test(fen)) {
        return false;
    }
    i = fen.indexOf('b');
    if (i !== -1 && fen.indexOf('b', i + 1) !== -1) {
        return false;
    }

    return true;
};

$.Engine.isLegalKingMove = function (position, move) {
    var startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        piece = position.getPiece(startSquare),
        newPiece = position.getPiece(endSquare);

    // castling
    if (startSquare.compareFile(endSquare) === 2) {
        if (piece.isWhite()) {
            if (endSquare.getName() === 'g1' && position.canWhiteCastleKingside() && position.getPiece(new $.Square('f1')).isNull() && position.getPiece(new $.Square('g1')).isNull()) {
                // castle kingside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('e1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('f1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('g1'), 'b')) {
                    return false;
                }
            } else if (endSquare.getName() === 'c1' && position.canWhiteCastleQueenside() && position.getPiece(new $.Square('d1')).isNull() && position.getPiece(new $.Square('c1')).isNull() && position.getPiece(new $.Square('b1')).isNull()) {
                // castle queenside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('c1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('d1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('e1'), 'b')) {
                    return false;
                }
            } else {
                return false;
            }
        } else if (piece.isBlack()) {
            if (endSquare.getName() === 'g8' && position.canBlackCastleKingside() && position.getPiece(new $.Square('f8')).isNull() && position.getPiece(new $.Square('g8')).isNull()) {
                // castle kingside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('e8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('f8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('g8'), 'w')) {
                    return false;
                }
            } else if (endSquare.getName() === 'c8' && position.canBlackCastleQueenside() && position.getPiece(new $.Square('d8')).isNull() && position.getPiece(new $.Square('c8')).isNull() && position.getPiece(new $.Square('b8')).isNull()) {
                // castle queenside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('b8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('c8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('d8'), 'w')) {
                    return false;
                }
            } else {
                return false;
            }
        }
    } else if (!startSquare.isKingMove(endSquare)) {
        return false;
    }

    return true;
};

$.Engine.isLegalPawnMove = function (position, move) {
    var startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        piece = position.getPiece(startSquare),
        newPiece = position.getPiece(endSquare);

    // pawns must move forward
    if (piece.isWhite() && startSquare.diffRank(endSquare) < 1) {
        return false;
    }
    if (piece.isBlack() && startSquare.diffRank(endSquare) > -1) {
        return false;
    }

    // pawns move 1 square (or 2 on first move)
    var rankDiff = startSquare.compareRank(endSquare);
    var moveOneSquare = (rankDiff === 1);
    var moveTwoSquares = (rankDiff === 2);
    var blockSquare;
    blockSquare = startSquare.clone();
    blockSquare.setRank(3);
    var whiteUnblocked = position.getPiece(blockSquare).isNull();
    blockSquare = startSquare.clone();
    blockSquare.setRank(6);
    var blackUnblocked = position.getPiece(blockSquare).isNull();
    var whiteFirstMove = (piece.isWhite() && startSquare.getRank() === '2');
    var blackFirstMove = (piece.isBlack() && startSquare.getRank() === '7');
    if (!(moveOneSquare || (moveTwoSquares && (whiteFirstMove && whiteUnblocked || blackFirstMove && blackUnblocked)))) {
        return false;
    }

    // pawns cannot capture directly forward
    if (startSquare.isSameFile(endSquare) && !newPiece.isNull()) {
        return false;
    }

    // pawns cannot move horizontally unless capturing 1 square on a forward-diagonal
    if (!startSquare.isSameFile(endSquare)) {
        // if side to side movement, only the following situations are valid
        is_capturing_enemy = (!newPiece.isNull() && !newPiece.isColor(piece.getColor()));
        is_en_passant = endSquare.equals(position.getEnPassantSquare());
        var oneRank = (startSquare.compareRank(endSquare) === 1);
        var oneFile = (startSquare.compareFile(endSquare) === 1);
        if (!(oneFile && oneRank && (is_capturing_enemy || is_en_passant))) {
            return false;
        }
    }

    return true;
};

$.Engine.isCheck = function (position) {
    var kingSquare = position.findPiece(position.getColorToMove() + 'k')[0];
    return kingSquare !== undefined && this.isSquareAttacked(position, kingSquare, position.getColorNotToMove());
};

$.Engine.isMate = function (position) {
    return this.isCheck(position) && this.getLegalMoves(position).length === 0;
};

$.Engine.isSquareAttacked = function (position, square, pieceColor) {
    return (this.getAttackers(position, square, pieceColor).length > 0);
};

$.Engine.testMove = function (position, move) {
    var captureSquare,
        startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        piece = position.getPiece(startSquare),
        isEnPassant = piece.isPawn() && endSquare.equals(position.getEnPassantSquare()),

    testPosition = position.clone();
    testPosition.setPiece(endSquare, '', piece.toString());
    testPosition.setPiece(startSquare, '', '');

    if (isEnPassant) {
        captureSquare = new $.Square(endSquare.getFile() + startSquare.getRank());
        testPosition.setPiece(captureSquare, '', '');
    }

    return testPosition;
};

return $.Engine;

}(CHESS);

;
var CHESS = CHESS || {};

CHESS.LongNotation = function ($) {

    /**
     * @class
     * @param {Position} position
     */
    function LongNotation (position) {
        this.getLongNotation = function (shortNotation) {
            var i,
                colorToMove,
                endSquare,
                move,
                piece,
                pieceLetter,
                squareList,
                startSquareHint,
                startSquare;

            if (shortNotation.lastIndexOf('O-O-O', 0) === 0) {
                return (position.isWhiteToMove() ? 'e1-c1' : 'e8-c8');
            }
            if (shortNotation.lastIndexOf('O-O', 0) === 0) {
                return (position.isWhiteToMove() ? 'e1-g1' : 'e8-g8');
            }

            startSquareHint = extractStartSquareHint(shortNotation);
            colorToMove = (position.isWhiteToMove() ? 'w' : 'b');
            pieceLetter = extractPieceLetter(shortNotation);
            piece = new $.Piece(colorToMove + pieceLetter);
            endSquare = extractEndSquare(shortNotation);
            squareList = getSquareList(startSquareHint);

            for (i = 0; i < squareList.length; i++) {
                startSquare = squareList[i];
                if (!squareHasCorrectPiece(startSquare, piece)) {
                    continue;
                }
                if (!pieceCanLegallyMove(piece, startSquare, endSquare)) {
                    continue;
                }
                return (startSquare.getName() + '-' + endSquare.getName());
            }
        };

        var getSquareList = function (startSquareHint) {
            if (/[1-8]/.test(startSquareHint)) {
                return getRankSquares(startSquareHint);
            }
            if (/[a-h]/.test(startSquareHint)) {
                return getFileSquares(startSquareHint);
            }
            return $.Square.getAllSquares();
        };

        var getRankSquares = function (rank) {
            var squareList = [],
                square = new $.Square('a' + rank);

            do {
                squareList.push(square.clone());
            } while (square.addFile(1));

            return squareList;
        };

        var getFileSquares = function (file) {
            var squareList = [],
                square = new $.Square(file + '1');

            do {
                squareList.push(square.clone());
            } while (square.addRank(1));

            return squareList;
        };

        var squareHasCorrectPiece = function (square, piece) {
            return position.getPiece(square).equals(piece);
        };

        var pieceCanLegallyMove = function (piece, startSquare, endSquare) {
            var move = new $.Move(startSquare, endSquare);
            return $.Engine.isLegal(position, move);
        };

        var extractSquareInfo = function (shortNotation) {
            return shortNotation.replace(/[#+=xKQRBN]/g, '');
        };

        var extractEndSquare = function (shortNotation) {
            var endSquare = extractSquareInfo(shortNotation);
            if (endSquare.length === 3) {
                return new $.Square(endSquare.substr(1, 2));
            }
            return new $.Square(endSquare);
        };

        var extractStartSquareHint = function (shortNotation) {
            var squareInfo = extractSquareInfo(shortNotation);
            if (squareInfo.length === 3) {
                return squareInfo.substr(0, 1);
            }
            return '';
        };

        var extractPieceLetter = function (shortNotation) {
            pieceLetter = shortNotation.substring(0, 1);
            if (!/[KQRBN]/.test(pieceLetter)) {
                return 'p';
            }
            return pieceLetter.toLowerCase();
        };
    }

    return LongNotation;

}(CHESS);

;
/**
 * Board module
 */
CHESS.Board = function ($) {

return function (config, fn) {

    var
        init,
        /**
         * Contains methods for responding to user interaction. Updates the model and the view.
         * @private
         */
        controller = {
            subscribers: {
                any: []
            }
        },
        /**
         * Holds the internal state of the board.
         * @private
         */
        model = {
            active: false, // Might not be used/needed
            position: new $.Position(),
            piecebox: [
                ['-', 'wk', 'wq', 'wr', 'wb', 'wn', 'wp', '-'],
                ['-', 'bk', 'bq', 'br', 'bb', 'bn', 'bp', '-']
            ]
        },
        /**
         * Contains methods for updating the user interface.
         * @private
         */
        view = {
            container: null,
            canvas: null,
            ctx: null,
            snapshot: null,
            snapshot_ctx: null,
            snapshot_img: new Image(),
            square_size: 0,
            square_color_light: '#ececd7',
            square_color_dark: '#7389b6',
            square_hover_light: '#b4d990',
            square_hover_dark: '#85c249',
            square_uri_light: new Image(),
            square_uri_dark: new Image(),
            dpi_ratio: 1,
            dragok: false,
            drag_piece: '',
            // Array position of piece being dragged
            drag_clear_i: 0,
            // Array position of piece being dragged
            drag_clear_j: 0,
            // Path to the images folder
            image_path: 'canvaschess/img/',
            // Coordinate of the mouse/touch event
            left: 0,
            // Coordinate of the mouse/touch event
            top: 0,
            // Coordinate of the last draw of a dragged piece
            last_draw_left: 0,
            // Coordinate of the last draw of a dragged piece
            last_draw_top: 0,
            // Number of piece images loaded
            loaded_pieces: 0,
            // Does the piece need cleared from the starting square at the start of a drag?
            piece_not_lifted: true,
            // The white pieces are at the bottom of the screen
            white_down: true,
            // Opacity for arrows, squares, lines, X's, etc
            gc_opacity: '0.8',
            highlight_move: false,
            highlight_move_color: '#FF0000',
            highlight_move_opacity: '0.5',
            highlight_hover: false,
            // Assumes that the HTML file is in the same directory as canvaschess
            piece_set: 'canvaschess/img/pieces/merida/',
            show_labels: true,
            arrow_list: [],
            square_list: [],
            wp: new Image(),
            wr: new Image(),
            wn: new Image(),
            wb: new Image(),
            wq: new Image(),
            wk: new Image(),
            bp: new Image(),
            br: new Image(),
            bn: new Image(),
            bb: new Image(),
            bq: new Image(),
            bk: new Image()
        };

    /**
     * Respond to touch-leave or touch-cancel.
     *
     * @param e - The event object.
     */
    controller.myCancel = function (e) {
        e.preventDefault();
        view.dragok = false;
        view.drag_piece = '';
        view.left = 0;
        view.top = 0;
        view.takeSnapshot();
    };

    /**
     * Respond to mouse-down or touch-start.
     *
     * @param e - The event object.
     */
    controller.myDown = function (e) {
        var i,
            j,
            piece,
            piece_color,
            rect = view.canvas.getBoundingClientRect();

        if (model.active) {
            if ('clientX' in e) {
                // Mouse event
                view.left = e.clientX - rect.left;
                view.top = e.clientY - rect.top;
                view.canvas.style.cursor = 'move';
            } else if ('changedTouches' in e) {
                // Touch event
                view.left = e.changedTouches[0].pageX - rect.left;
                view.top = e.changedTouches[0].pageY - rect.top;
            } else {
                return;
            }

            // Adjust for hiDPI devices
            view.top = view.top * view.dpi_ratio;
            view.left = view.left * view.dpi_ratio;

            i = parseInt(view.top / view.square_size, 10);
            j = parseInt(view.left / view.square_size, 10);

            // Flip board for black
            if (!view.white_down) {
                i = 7 - i;
                j = 7 - j;
            }

            if (i < 8) {
                // Dragging a piece on the board
                piece = model.position.getPiece(i, j);
            } else {
                // Dragging a piece in the piece box
                if (model.mode === 'setup') {
                    piece = new $.Piece(model.piecebox[i - 8][j]);
                }
            }

            // TODO: determine how to handle this now that piece is no longer a string.
            /*if (piece === undefined) {
                // Prevent dragging if coordinate system is broken (this can happen with mobile devices when the page is zoomed)
                view.active = false;
                return;
            }*/

            if (model.mode !== 'setup' && ((model.position.isWhiteToMove() && piece.isBlack()) || (!model.position.isWhiteToMove() && piece.isWhite()))) {
                view.canvas.style.cursor = 'default';
                return;
            }

            if (!piece.isNull()) {
                view.drag_clear_i = i;
                view.drag_clear_j = j;
                view.drag_piece = piece.toString();
                view.dragok = true;
                view.takeSnapshot(false);
            } else {
                view.canvas.style.cursor = 'default';
            }
        }
    };

    /**
     * Respond to mouse-move or touch-move. No relation to the touch-move rule in chess ;).
     *
     * @param e - The event object.
     */
    controller.myMove = function (e) {
        e.preventDefault();
        var myview = view,
            i,
            j,
            ii,
            jj,
            piece,
            clip_start_x,
            clip_start_y,
            clip_width,
            clip_height,
            x,
            y,
            draw_height,
            rect = myview.canvas.getBoundingClientRect(),
            //is_square_light,
            board_size = myview.square_size * 8;

        if (myview.dragok) {
            i = parseInt(myview.top / myview.square_size, 10);
            j = parseInt(myview.left / myview.square_size, 10);
            clip_start_x = (j - 1) * myview.square_size;
            clip_start_y = (i - 1) * myview.square_size;
            clip_width = myview.square_size * 3;
            clip_height = myview.square_size * 3;

            // Draw 3x3 from the snapshot
            if (!(i < 0 || i > 7 || j < 0 || j > 7)) {
                if (clip_start_x < 0) {
                    clip_start_x = 0;
                }
                if (clip_start_y < 0) {
                    clip_start_y = 0;
                }
                if (clip_start_x + clip_width > board_size) {
                    clip_width = board_size - clip_start_x;
                }
                if (clip_start_y + clip_height > board_size) {
                    clip_height = board_size - clip_start_y;
                }
                // Clear the section of the board where the drag piece was drawn
                myview.ctx.drawImage(myview.snapshot, clip_start_x, clip_start_y, clip_width, clip_height, clip_start_x, clip_start_y, clip_width, clip_height);
            }

            // Update values
            if ('clientX' in e) {
                // Mouse event
                myview.left = e.clientX - rect.left;
                myview.top = e.clientY - rect.top;
            } else if ('changedTouches' in e) {
                // Touch event
                myview.left = e.changedTouches[0].pageX - rect.left;
                myview.top = e.changedTouches[0].pageY - rect.top;
            } else {
                return;
            }

            // Adjust for hiDPI devices
            myview.top = myview.top * myview.dpi_ratio;
            myview.left = myview.left * myview.dpi_ratio;

            i = parseInt(myview.top / myview.square_size, 10);
            j = parseInt(myview.left / myview.square_size, 10);

            // Make sure the piece is over the board
            if (i < 0 || i > 7 || j < 0 || j > 7) {
                return;
            }

            // Highlight hover square
            if (myview.highlight_hover) {
                myview.drawSquare('hover', i * myview.square_size, j * myview.square_size);
            }

            // Draw any piece that was sitting on the hover square
            ii = i;
            jj = j;
            if (!myview.white_down) {
                ii = 7 - i;
                jj = 7 - j;
            }
            piece = model.position.getPiece(ii, jj);
            if (!piece.isNull() && !(ii === myview.drag_clear_i && jj === myview.drag_clear_j)) {
                x = parseInt((j * myview.square_size), 10);
                y = parseInt((i * myview.square_size), 10);
                myview.ctx.drawImage(myview[piece.toString()], x, y, myview.square_size, myview.square_size);
            }

            // Draw drag piece
            x = parseInt(((myview.left - (myview.square_size / 2))), 10);
            y = parseInt(((myview.top - (myview.square_size / 2))), 10);

            // Trim drawing region so it doesn't go into the piece box
            draw_height = myview.square_size;
            if (model.mode === 'setup' && myview.top > myview.square_size * 7.5) {
                draw_height = draw_height - ((myview.top - myview.square_size * 7.5));
            }
            
            // Draw the piece
            myview.ctx.drawImage(myview[myview.drag_piece.substr(0, 2)], x, y, myview.square_size, draw_height);
        }
    };

    /**
     * Respond to mouse-up or touch-end.
     *
     * @param e - The event object.
     */
    controller.myUp = function (e) {
        var sq1,
            sq2,
            alpha_conversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            my_x,
            my_y,
            i,
            j,
            xy1,
            xy2,
            rect = view.canvas.getBoundingClientRect(),
            drag_piece_temp;

        // Cannot move unless game is active and a piece has been selected
        if (model.active && view.dragok) {
            if ('clientX' in e) {
                // Mouse event

                // Adjust for hiDPI devices
                my_x = (e.clientX - rect.left) * view.dpi_ratio;
                my_y = (e.clientY - rect.top) * view.dpi_ratio;

                i = parseInt(my_y / view.square_size, 10);
                j = parseInt(my_x / view.square_size, 10);
                view.canvas.style.cursor = 'default';
            } else if ('changedTouches' in e) {
                // Touch event

                // Adjust for hiDPI devices
                my_x = (e.changedTouches[0].pageX - rect.left) * view.dpi_ratio;
                my_y = (e.changedTouches[0].pageY - rect.top) * view.dpi_ratio;                

                i = parseInt(my_y / view.square_size, 10);
                j = parseInt(my_x / view.square_size, 10);
            } else {
                return;
            }

            // Flip board for black
            if (!view.white_down) {
                i = 7 - i;
                j = 7 - j;
            }

            // Hold the drag piece info
            drag_piece_temp = view.drag_piece;

            // End the drag
            view.dragok = false;
            view.drag_piece = '';
            view.left = 0;
            view.top = 0;
            view.piece_not_lifted = true;

            // Change position
            if (view.drag_clear_i >= 8) {
                sq1 = 'piecebox';
            } else {
                sq1 = alpha_conversion[view.drag_clear_j] + (8 - view.drag_clear_i);
            }

            if (i >= 8) {
                sq2 = 'piecebox';
            } else {
                sq2 = alpha_conversion[j] + (8 - i);
            }

            xy1 = view.getArrayPosition(sq1);
            xy2 = view.getArrayPosition(sq2);

            if (model.mode === 'setup') {
                if (sq1 !== sq2 && sq1 !== 'piecebox' && sq2 !== 'piecebox') {
                    model.position.setPiece(xy2.substr(1, 1), xy2.substr(0, 1), drag_piece_temp);
                    model.position.setPiece(xy1.substr(1, 1), xy1.substr(0, 1), '');
                } else {
                    if (sq1 === 'piecebox' && sq2 === 'piecebox') {
                        // Do nothing
                    } else if (sq1 === 'piecebox') {
                        model.position.setPiece(xy2.substr(1, 1), xy2.substr(0, 1), drag_piece_temp);
                    } else if (sq2 === 'piecebox') {
                        model.position.setPiece(xy1.substr(1, 1), xy1.substr(0, 1), '');
                    }
                }
            } else {
                // Play move
                model.move(sq1, sq2);
            }

            view.takeSnapshot();
        }
    };

    /**
     * Notify all subscribers of an event.
     *
     * @param {string} publication - The data or message to send to the subscribers.
     * @param {string} type - Type of event.
     */
    controller.publish = function (publication, type) {
        this.visitSubscribers('publish', publication, type);
    };

    /**
     * Notify all subscribers of an event, or remove a subscriber from the list.
     *
     * @param {string} action - If not "publish", then "unsubscribe" is assumed.
     * @param {object} arg - Arguments to be passed to a callback function, or the callback function itself if unsubscribing.
     * @param {number} type - Type of event.
     */
    controller.visitSubscribers = function (action, arg, type) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[pubtype],
            i,
            max = 0;
        if (subscribers !== undefined) {
            max = subscribers.length;
        }
        for (i = 0; i < max; i += 1) {
            if (action === 'publish') {
                subscribers[i](arg);
            } else {
                if (subscribers[i] === arg) {
                    subscribers.splice(i, 1);
                }
            }
        }
    };

    /**
     * Resize the board.
     *
     * @param {number} [height=0] - The new height of the board.
     * @param {number} [width=0] - The new width of the board.
     */
    controller.resize = function (height, width) {
        var old_width,
            old_height,
            smaller_size = 0,
            rows = 8,
            devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio =
                view.ctx.webkitBackingStorePixelRatio ||
                view.ctx.mozBackingStorePixelRatio || 
                view.ctx.msBackingStorePixelRatio || 
                view.ctx.oBackingStorePixelRatio || 
                view.ctx.BackingStorePixelRatio || 1;

        // Clean
        height = height || 0;
        width = width || 0;
        height = parseInt(height, 10);
        width = parseInt(width, 10);

        // Attempt to fill the container if no values are found
        if (height === 0 || width === 0) {
            if (view.canvas.parentNode) {
                height = parseInt(window.getComputedStyle(view.canvas.parentNode, null).getPropertyValue('height'), 10);
                width = parseInt(window.getComputedStyle(view.canvas.parentNode, null).getPropertyValue('width'), 10);
            }
        }

        smaller_size = (height < width ? height : width);

        if (model.mode === 'setup') {
            rows = 10;
        }

        view.square_size = (height < width ? parseInt(smaller_size / rows, 10) : parseInt(smaller_size / 8, 10));
        view.canvas.height = view.square_size * rows;
        view.canvas.width = view.square_size * 8;

        // Adjust the pixel ratio for hiDPI devices
        view.dpi_ratio = devicePixelRatio / backingStoreRatio;

        if (devicePixelRatio !== backingStoreRatio) {
            old_width = view.canvas.width;
            old_height = view.canvas.height;

            view.canvas.width = old_width * view.dpi_ratio;
            view.canvas.height = old_height * view.dpi_ratio;
            view.canvas.style.width = old_width + 'px';
            view.canvas.style.height = old_height + 'px';

            view.square_size = view.canvas.width / 8;
        }

    };

    /**
     * Update the internal board with a new move.
     *
     * @param {string} sq1 - Current square (eg. e2).
     * @param {string} sq2 - New square (eg. e4).
     */
    model.move = function (sq1, sq2, promotion) {
        var pos = new $.Position(this.position.getFen()),
            pos_before = {
                fen: this.position.getFen(), //$.Engine.getFEN(this),
                player_to_move: (this.position.isWhiteToMove() ? 'w' : 'b'),
                sq1: sq1,
                sq2: sq2,
                promote: false,
                mate: false,
                stalemate: false
            },
            xy1,
            xy2,
            piece;

        if (this.position.last_move) {
            pos.last_move = {
                'sq1': this.position.last_move.sq1,
                'sq2': this.position.last_move.sq2
            };
        }

        xy1 = view.getArrayPosition(sq1);
        xy2 = view.getArrayPosition(sq2);
        piece = this.position.getPiece(xy1.substr(1, 1), xy1.substr(0, 1));
        if (piece.isPawn() && ((this.position.isWhiteToMove() && sq2.substr(1, 1) === '8') || (!this.position.isWhiteToMove() && sq2.substr(1, 1) === '1'))) {
            pos_before.promote = true;
        }

        // Illegal move
        var startSquare = new $.Square(sq1);
        var endSquare = new $.Square(sq2);
        var move = new $.Move(startSquare, endSquare);
        var boardMover = new $.BoardMover(pos);
        if (!boardMover.move(move, promotion)) {
            view.takeSnapshot();
            return;
        }

        // Remove graphic commentary
        view.arrow_list = [];

        if ($.Engine.isMate(pos)) {
            pos_before.mate = true;
        } else if ($.Engine.isStalemate(pos)) {
            pos_before.stalemate = true;
        }

        // Publish the state before the move is played
        controller.publish(pos_before, 'move_before');

        // Apply position
        this.position = pos;
        this.moves += 1;

        view.takeSnapshot();

        if (!this.active) {
            return;
        }
        
    };

    /**
     * Add an arrow to the arrow list.
     *
     * @param {string} sq1 - Current square (eg. e2).
     * @param {string} sq2 - New square (eg. e4).
     * @param {string} color - Hex code for the color of the arrow.
     * @param {float} opacity - A number between 0 and 1 (0 = fully transparent, 1 = fully opaque).
     */
    view.arrowAdd = function (sq1, sq2, color, opacity) {
        var rgba = view.hexToRgba(color);

        rgba.a = opacity;

        this.arrow_list.push({
            sq1: sq1,
            sq2: sq2,
            rgba: rgba
        });
    };

    /**
     * Draw an arrow on the board.
     *
     * @param {string} sq1 - Current square (eg. e2).
     * @param {string} sq2 - New square (eg. e4).
     * @param {object} rgba - An object with properties 'r', 'g', 'b', and 'a', which define the color/opacity of the arrow.
     */
    view.arrowDraw = function (sq1, sq2, rgba) {
        var xy1,
            xy2,
            x1,
            y1,
            x2,
            y2,
            x2_short, // less distance, leave room for the arrow head
            y2_short, // less distance, leave room for the arrow head,
            slope,
            x_diff,
            line_width = view.square_size / 6,
            head_length = this.square_size / 2.4,
            angle = Math.PI / 6, // Determines the width of the arrow head,
            lineangle,
            head_side_length,
            angle1,
            topx,
            topy,
            angle2,
            botx,
            boty; // The length of a side of the arrow head

        // Position/color values
        xy1 = view.getArrayPosition(sq1);
        xy2 = view.getArrayPosition(sq2);
        x1 = xy1.substr(0, 1);
        y1 = xy1.substr(1, 1);
        x2 = xy2.substr(0, 1);
        y2 = xy2.substr(1, 1);

        // Flip board for black
        if (!view.white_down) {
            x1 = 7 - x1;
            y1 = 7 - y1;
            x2 = 7 - x2;
            y2 = 7 - y2;
        }

        x1 = x1 * this.square_size + (this.square_size / 2);
        y1 = y1 * this.square_size + (this.square_size / 2);
        x2 = x2 * this.square_size + (this.square_size / 2);
        y2 = y2 * this.square_size + (this.square_size / 2);

        // Shorten the line by the length of the arrow head
        if (x1 === x2) {
            x2_short = x2;
            y2_short = (y2 > y1 ? y2 - head_length : y2 + head_length);
        } else {
            slope = (y2 - y1) / (x2 - x1);
            x_diff = Math.sqrt(((head_length * head_length) / ( 1 + slope * slope)));
            x2_short = (x2 > x1 ? x2 - x_diff : x2 + x_diff);
            y2_short = slope * (x2_short - x2) + y2;
        }

        // Draw arrow body
        this.snapshot_ctx.beginPath();
        this.snapshot_ctx.strokeStyle = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ', ' + rgba.a + ')';
        this.snapshot_ctx.fillStyle = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ', ' + rgba.a + ')';
        this.snapshot_ctx.lineWidth = line_width;
        this.snapshot_ctx.moveTo(x1, y1);
        this.snapshot_ctx.lineTo(x2_short, y2_short);
        this.snapshot_ctx.stroke();

        // Math for the arrow head
        lineangle = Math.atan2(y2 - y1, x2 - x1);
        head_side_length = Math.abs(head_length / Math.cos(angle));
        angle1 = lineangle + Math.PI + angle;
        topx = x2 + Math.cos(angle1) * head_side_length;
        topy = y2 + Math.sin(angle1) * head_side_length;
        angle2 = lineangle + Math.PI - angle;
        botx = x2 + Math.cos(angle2) * head_side_length;
        boty = y2 + Math.sin(angle2) * head_side_length;

        this.snapshot_ctx.beginPath();
        this.snapshot_ctx.lineWidth = 2;
        this.snapshot_ctx.moveTo(botx, boty);
        this.snapshot_ctx.lineTo(topx, topy);
        this.snapshot_ctx.lineTo(x2, y2);
        this.snapshot_ctx.lineTo(botx, boty);
        this.snapshot_ctx.fill();
    };

    /**
     * Draw all arrows.
     */
    view.arrowDrawAll = function () {
        var i,
            sq1,
            sq2,
            rgba;

        for (i = 0; i < this.arrow_list.length; i += 1) {
            sq1 = this.arrow_list[i].sq1;
            sq2 = this.arrow_list[i].sq2;
            rgba = this.arrow_list[i].rgba;
            view.arrowDraw(sq1, sq2, rgba);
        }
    };

    /**
     * Create the canvas element and an image buffer.
     */
    view.buildHtml = function (container) {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'chessboard';
        this.canvas.setAttribute('tabindex', 0);
        this.ctx = this.canvas.getContext('2d');
        this.snapshot = document.createElement('canvas');
        this.snapshot_ctx = this.snapshot.getContext('2d');
        if (container !== undefined) {
            document.getElementById(container).appendChild(this.canvas);
        }
    };

    view.getArrayPosition = function (sq) {
        var x,
            y,
            xy = false;

        if (/^[a-h][1-8]$/.test(sq)) {
            x = sq.substr(0, 1).toLowerCase();
            y = sq.substr(1, 1);
            x = x.charCodeAt(0) - 97;
            y = 8 - y;
            xy = x + '' + y;
        }
        return xy;
    };

    /**
     * Convert a hex color string to RGBA object.
     *
     * @param {string} hex - Color string in hex format.
     * @returns {object} RGBA color object.
     */
    view.hexToRgba = function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return (result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: 1
        } : null);
    };

    /**
     * Activate/Inactivate the board.
     *
     * @param {boolean} a - active
     */
    view.setActive = function (a) {

        model.active = (a === true);

        if (model.active) {

            // Mouse and touch events
            view.canvas.onmousedown = controller.myDown;
            view.canvas.onmouseup = controller.myUp;
            view.canvas.onmousemove = controller.myMove;
            view.canvas.addEventListener('touchstart', controller.myDown, false);
            view.canvas.addEventListener('touchend', controller.myUp, false);
            view.canvas.addEventListener('touchmove', controller.myMove, false);
            view.canvas.addEventListener('touchleave', controller.myCancel, false);
            view.canvas.addEventListener('touchcancel', controller.myCancel, false);

        } else {

            view.canvas.removeEventListener('touchstart', controller.myDown);
            view.canvas.removeEventListener('touchend', controller.myUp);
            view.canvas.removeEventListener('touchmove', controller.myMove);
            view.canvas.removeEventListener('touchleave', controller.myCancel);
            view.canvas.removeEventListener('touchcancel', controller.myCancel);

        }
    };

    /**
     * Add a colored square to the square list.
     *
     * @param {string} sq - Square (eg. e2).
     * @param {string} color - Hex code for the color of the square.
     * @param {float} opacity - A number between 0 and 1 (0 = fully transparent, 1 = fully opaque).
     */
    view.squareAdd = function (sq, color, opacity) {
        var rgba = view.hexToRgba(color);

        rgba.a = opacity;

        this.square_list.push({
            sq: sq,
            rgba: rgba
        });
    };

    /**
     * Draw a colored square on the board.
     *
     * @param {string} sq - Current square (eg. e2).
     * @param {object} rgba - An object with properties 'r', 'g', 'b', and 'a', which define the color/opacity of the square.
     */
    view.squareDraw = function (sq, rgba) {
        var xy,
            x,
            y; // The length of a side of the arrow head

        // Position/color values
        xy = this.getArrayPosition(sq);
        x = xy.substr(0, 1);
        y = xy.substr(1, 1);

        // Flip board for black
        if (!view.white_down) {
            x = 7 - x;
            y = 7 - y;
        }

        this.snapshot_ctx.beginPath();
        this.snapshot_ctx.fillStyle = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ', ' + rgba.a + ')';
        this.snapshot_ctx.rect(x * this.square_size, y * this.square_size, this.square_size, this.square_size);
        this.snapshot_ctx.fill();
    };

    /**
     * Draw all squares.
     */
    view.squareDrawAll = function () {
        var i,
            sq,
            rgba;

        for (i = 0; i < this.square_list.length; i += 1) {
            sq = this.square_list[i].sq;
            rgba = this.square_list[i].rgba;
            view.squareDraw(sq, rgba);
        }
    };

    /**
     * Draw a piece to the image buffer.
     *
     * @param {string} piece - The piece to draw.
     * @param {number} x - The horizontal position in pixels.
     * @param {number} y - The vertical position in pixels.
     */
    view.drawPiece = function (piece, x, y) {

        if (!/^[bw][kqrbnp]$/.test(piece)) {
            return;
        }

        this.snapshot_ctx.drawImage(this[piece], x, y, this.square_size, this.square_size);
    };

    /**
     * Draw a square image to the image buffer.
     *
     * @param {string} color - hover, light, dark.
     * @param {number} x - The horizontal position in pixels.
     * @param {number} y - The vertical position in pixels.
     */
    view.drawSquare = function (color, x, y, context) {
        var ctx = context || this.snapshot_ctx,
            image,
            col = parseInt(x / this.square_size, 10),
            row = parseInt(y / this.square_size, 10),
            rowcol,
            font_size,
            font_margin_top = parseInt(this.square_size / 55 * 13, 10),
            font_margin_left = parseInt(this.square_size / 55 * 9, 10);

        if (color === 'hover') {
            this.ctx.beginPath();
            if ((col + row) % 2 === 0) {
                this.ctx.fillStyle = this.square_hover_light;
            } else {
                this.ctx.fillStyle = this.square_hover_dark;
            }
            this.ctx.rect(row * this.square_size, col * this.square_size, this.square_size, this.square_size);
            this.ctx.fill();
        } else {
            image = (color === 'light' ? this.square_uri_light : this.square_uri_dark);
            if (image.src !== '') {
                this.snapshot_ctx.drawImage(image, x, y, this.square_size, this.square_size);
            } else {
                this.snapshot_ctx.beginPath();
                this.snapshot_ctx.fillStyle = (color === 'light' ? this.square_color_light : this.square_color_dark);
                this.snapshot_ctx.rect(x, y, this.square_size, this.square_size);
                this.snapshot_ctx.fill();
            }
        }

        // Row/Col labels
        if (this.show_labels && (row === 7 || col === 0)) {
            // Font
            font_size = parseInt(this.square_size / 55 * 12, 10);
            this.snapshot_ctx.font = font_size + 'px arial';
            this.snapshot_ctx.fillStyle = (((7 - row) + col) % 2 === 0 ? this.square_color_light : this.square_color_dark);

            if (col === 0) {
                // Row (display number)
                if (this.white_down) {
                    rowcol = 8 - row;
                } else {
                    rowcol = row + 1;
                }
                this.snapshot_ctx.fillText(rowcol, 2, (row * this.square_size) + font_margin_top);
            }
            if (row === 7) {
                // Columns (display letter)
                if (this.white_down) {
                    rowcol = String.fromCharCode(col + 97);
                } else {
                    rowcol = String.fromCharCode((7 - col) + 97);
                }
                this.snapshot_ctx.fillText(rowcol, ((this.square_size * col) + this.square_size) - font_margin_left, (this.square_size * 8) - 2);
            }
        }
    };

    /**
     * Draw the board to an image buffer.
     */
    view.takeSnapshot = function (refresh) {
        var i,
            j,
            ii,
            jj,
            x,
            y,
            x_pos,
            y_pos,
            piece,
            rows = 8,
            is_square_light,
            rgba = view.hexToRgba(this.highlight_move_color);

        // Prepare canvas for snapshot
        if (model.mode === 'setup') {
            rows = 10;
        }
        this.snapshot.width = this.square_size * 8;
        this.snapshot.height = this.square_size * rows;

        // Draw chessboard
        for (y = 0; y < 8; y += 1) {
            for (x = 0; x < 8; x += 1) {
                if ((x + y) % 2 === 0) {
                    x_pos = x * this.square_size;
                    y_pos = y * this.square_size;
                    this.drawSquare('light', x_pos, y_pos);
                }
            }
        }
        for (y = 0; y < 8; y += 1) {
            for (x = 0; x < 8; x += 1) {
                if ((x + y) % 2 !== 0) {
                    x_pos = x * this.square_size;
                    y_pos = y * this.square_size;
                    this.drawSquare('dark', x_pos, y_pos);
                }
            }
        }

        // Highlight last move, sq1
        if (this.highlight_move) {
            if (typeof model.position.last_move === 'object' && model.position.last_move.sq1 !== undefined) {
                this.snapshot_ctx.beginPath();
                this.snapshot_ctx.fillStyle = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ', ' + this.highlight_move_opacity + ')';

                x = model.position.last_move.sq1.substr(0, 1);
                y = model.position.last_move.sq1.substr(1, 1);
                if (!this.white_down) {
                    x = 7 - x;
                    y = 7 - y;
                }
                this.snapshot_ctx.rect(x * this.square_size, y * this.square_size, this.square_size, this.square_size);

                x = model.position.last_move.sq2.substr(0, 1);
                y = model.position.last_move.sq2.substr(1, 1);
                if (!this.white_down) {
                    x = 7 - x;
                    y = 7 - y;
                }
                this.snapshot_ctx.rect(x * this.square_size, y * this.square_size, this.square_size, this.square_size);

                this.snapshot_ctx.fill();
            }
        }

        // Draw colored squares
        this.squareDrawAll();

        // Draw pieces
        for (i = 0; i < 8; i += 1) {
            for (j = 0; j < 8; j += 1) {
                if (!this.dragok || !(i === this.drag_clear_i && j === this.drag_clear_j)) {
                    piece = model.position.getPiece(i, j);
                    // Flip board for black
                    ii = i;
                    jj = j;
                    if (!this.white_down) {
                        ii = 7 - i;
                        jj = 7 - j;
                    }
                    x = jj * this.square_size;
                    y = ii * this.square_size;
                    if (!piece.isNull()) {
                        this.drawPiece(piece.toString(), x, y);
                    }
                }
            }
        }
        if (model.mode === 'setup') {
            // Draw piece box pieces
            for (i = 0; i < 2; i += 1) {
                for (j = 0; j < 8; j += 1) {
                    piece = new $.Piece(model.piecebox[i][j].substr(0, 2));
                    x = j * this.square_size;
                    y = (i + 8) * this.square_size;
                    if (!piece.isNull()) {
                        this.drawPiece(piece.toString(), x, y);
                    }
                }
            }
        }

        // Clear drag piece
        if (this.dragok) {
            i = this.drag_clear_i;
            j = this.drag_clear_j;
            if (!this.white_down) {
                i = 7 - this.drag_clear_i;
                j = 7 - this.drag_clear_j;
            }
            is_square_light = (i + j) % 2 === 0;
            if (is_square_light) {
                if (this.square_uri_light.src !== '') {
                    this.drawSquare('light', j * this.square_size, i * this.square_size, this.ctx);
                } else {
                    this.snapshot_ctx.beginPath();
                    this.snapshot_ctx.fillStyle = this.square_color_light;
                    this.snapshot_ctx.rect(j * this.square_size, i * this.square_size, this.square_size, this.square_size);
                    this.snapshot_ctx.fill();
                }
            } else {
                if (this.square_uri_dark.src !== '') {
                    this.drawSquare('dark', j * this.square_size, i * this.square_size, this.ctx);
                } else {
                    this.snapshot_ctx.beginPath();
                    this.snapshot_ctx.fillStyle = this.square_color_dark;
                    this.snapshot_ctx.rect(j * this.square_size, i * this.square_size, this.square_size, this.square_size);
                    this.snapshot_ctx.fill();
                }
            }
        }

        // Draw arrows
        this.arrowDrawAll();

        // Redraw the board from the image buffer
        if (refresh === undefined) {
            refresh = true;
        }
        if (refresh) {
            this.ctx.clearRect(0, this.square_size * 8, this.square_size * 8, this.square_size * 2);
            this.ctx.drawImage(this.snapshot, 0, 0);
        }
    };

    /**
     * Add an arrow to the board.
     *
     * @param {string} sq1 - Starting square in algebraic notation.
     * @param {string} sq2 - Ending square in algebraic notation.
     * @param {string} color - Hex code for the color of the arrow.
     * @param {float} opacity - A number between 0 and 1 (0 = fully transparent, 1 = fully opaque).
     */
    this.addArrow = function (sq1, sq2, color, opacity) {
        opacity = parseFloat(opacity);

        // Initialize to graphic commentary opacity if not set
        opacity = (opacity >= 0 && opacity <= 1 ? opacity : view.gc_opacity);

        // Full opacity if graphic commentary opacity is not set
        opacity = (opacity >= 0 && opacity <= 1 ? opacity : 1);

        view.arrowAdd(sq1, sq2, color, opacity);
        view.takeSnapshot();
    };

    /**
     * Add a colored square to the board.
     *
     * @param {string} sq - Square in algebraic notation.
     * @param {string} color - Hex code for the color of the square.
     * @param {float} opacity - A number between 0 and 1 (0 = fully transparent, 1 = fully opaque).
     */
    this.addSquare = function (sq, color, opacity) {
        opacity = parseFloat(opacity);

        // Initialize to graphic commentary opacity if not set
        opacity = (opacity >= 0 && opacity <= 1 ? opacity : view.gc_opacity);

        // Full opacity if graphic commentary opacity is not set
        opacity = (opacity >= 0 && opacity <= 1 ? opacity : 1);

        view.squareAdd(sq, color, opacity);
        view.takeSnapshot();
    };

    /**
     * Draw the board in its current state.
     */
    this.display = function () {
        view.takeSnapshot();
    };

    /**
     * Flip the board.
     *
     * @param {string} color - If provided, it will orient the board for white (w) or black (b).
     */
    this.flip = function (color) {

        if (color === 'w') {
            view.white_down = true;
        } else if (color === 'b') {
            view.white_down = false;
        } else {
            view.white_down = !view.white_down;
        }

        view.takeSnapshot();

    };

    /**
     * Get the color of the player to move.
     *
     * @returns {string} Color to move (w, b).
     */
    this.getActiveColor = function () {
        return (model.position.isWhiteToMove() ? 'w' : 'b');
    };

    /**
     * Get the FEN of the current position.
     *
     * @returns {string} FEN string.
     */
    this.getFEN = function () {
        return model.position.getFen();
    };

    /**
     * Get a reference to the canvas element.
     *
     * @returns {object} A reference to the canvas element.
     */
    this.getCanvas = function () {
        return view.canvas;
    };
    
    /**
     * Get a PNG format image of the current board.
     *
     * @returns {object} Image.
     */
    this.getImage = function () {
        var image = new Image();
        image.src = view.canvas.toDataURL('image/png');
        return image;
    };

    /**
     * Is the current position a draw by insufficient material?
     *
     * @returns {boolean} True or false.
     */
    this.isInsufficientMaterial = function () {
        return $.Engine.isInsufficientMaterial(model.position);
    };

    /**
     * Is the current position checkmate?
     *
     * @returns {boolean} True or false.
     */
    this.isMate = function () {
        return $.Engine.isMate(model.position);
    };

    /**
     * Is the current position stalemate?
     *
     * @returns {boolean} True or false.
     */
    this.isStalemate = function () {
        return $.Engine.isStalemate(model.position);
    };

    /**
     * Play a move.
     *
     * @param {string} san - Move in standard algebraic notation.
     */
    this.move = function (san) {
        var long_move,
            sq1,
            sq2,
            promotion;

        var longNotation = new $.LongNotation(model.position);
        long_move = longNotation.getLongNotation(san);
        long_move = long_move.split('-');
        sq1 = long_move[0];
        sq2 = long_move[1];

        if (/=[QRBN]/.test(san)) {
            promotion = san.match(/=([QRBN])/)[1];
}
        model.move(sq1, sq2, promotion);
    };

    /**
     * Clear the board.
     */
    this.positionClear = function () {
        model = new $.Position();
        view.takeSnapshot();
    };

    /**
     * Set the board to the starting position.
     */
    this.positionStart = function () {
        model.position.setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        model.position.last_move = {};
        model.position.moves = 0;

        view.takeSnapshot();
    };

    /**
     * Remove an arrow from the board.
     */
    this.removeArrow = function () {
        view.arrow_list.pop();
        view.takeSnapshot();
    };

    /**
     * Remove all arrows from the board.
     */
    this.removeAllArrows = function () {
        view.arrow_list = [];
        view.takeSnapshot();
    };

    /**
     * Remove a colored square from the board.
     */
    this.removeSquare = function () {
        view.square_list.pop();
        view.takeSnapshot();
    };

    /**
     * Remove all colored squares from the board.
     */
    this.removeAllSquares = function () {
        view.square_list = [];
        view.takeSnapshot();
    };

    /**
     * Resize the board.
     *
     * @param {number} [height=0] - The new height of the board.
     * @param {number} [width=0] - The new width of the board.
     */
    this.resize = function (height, width) {
        controller.resize(height, width);
        view.takeSnapshot();
    };

    /**
     * Activate/Inactivate the board.
     *
     * @param {boolean} active - True or False.
     */
    this.setActive = function (active) {
        view.setActive(active);
    };

    /**
     * Set the last move (for display purposes).
     *
     * @param {string} sq1 - Letter and number of the start square.
     * @param {string} sq2 - Letter and number of the end square.
     */
    this.setLastMove = function (sq1, sq2) {
        sq1 = view.getArrayPosition(sq1);
        sq2 = view.getArrayPosition(sq2);
        model.position.last_move = {'sq1': sq1, 'sq2': sq2};
    };

    /**
     * Change the board mode.
     *
     * @param {string} mode - Mode determines the default settings.
     */
    this.setMode = function (mode) {
        model.mode = mode;
        if (mode === 'setup') {
            view.setActive(true);
        }
        controller.resize(view.canvas.height, view.canvas.width);
        view.takeSnapshot();
    };

    /**
     * Set the board to a new position.
     *
     * @param {string} fen - FEN representation of the new position.
     */
    this.setPosition = function (fen) {
        model.position = new $.Position(fen);
        view.takeSnapshot();
    };

    /**
     * Allow other modules to subscribe to board change events.
     *
     * @param {string} type - Type of event.
     * @param {function} fn - A callback function.
     */
    this.subscribe = function (type, fn) {
        type = type || 'any';
        if (controller.subscribers[type] === undefined) {
            controller.subscribers[type] = [];
        }
        controller.subscribers[type].push(fn);
    };
    
    /**
     * Allow other modules to unsubscribe from board change events.
     *
     * @param {string} type - Type of event.
     * @param {function} fn - A callback function.
     */
    this.unsubscribe = function (fn, type) {
        controller.visitSubscribers('unsubscribe', fn, type);
    };

    // See declaration comment
    init = function () {
        var path;

        function callback () {
            if (typeof fn === 'function' && view.loaded_pieces === 12) {
                fn();
            }
        }

        view.buildHtml(config.container);

        view.setActive(true);

        view.highlight_move = (config.highlight_move === true ? true : false);
        view.highlight_hover = (config.highlight_hover === true ? true : false);
        view.show_labels = (config.show_labels === false ? false : true);
        view.square_color_light = (config.square_color_light ? config.square_color_light : view.square_color_light);
        view.square_color_dark = (config.square_color_dark ? config.square_color_dark : view.square_color_dark);
        view.gc_opacity = (config.gc_opacity ? config.gc_opacity : view.gc_opacity);
        view.highlight_move_color = (config.highlight_move_color ? config.highlight_move_color : view.highlight_move_color);
        view.highlight_move_opacity = (config.highlight_move_opacity ? config.highlight_move_opacity : view.highlight_move_opacity);
        view.square_hover_light = (config.square_hover_light ? config.square_hover_light : view.square_hover_light);
        view.square_hover_dark = (config.square_hover_dark ? config.square_hover_dark : view.square_hover_dark);
        view.piece_set = (config.piece_set ? config.piece_set : view.piece_set);
        model.mode = config.mode;

        if (config.fen) {
            model.position = new $.Position(config.fen);
        } else {
            model.position = new $.Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        }

        controller.resize(config.height, config.width);

        // Remove trailing slash if present
        path = view.piece_set.replace(/\/$/, '');

        // Preload graphics
        view.wp.src = path + '/wp.svg';
        view.wp.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
            }
        };

        view.wr.src = path + '/wr.svg';
        view.wr.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.wn.src = path + '/wn.svg';
        view.wn.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.wb.src = path + '/wb.svg';
        view.wb.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.wq.src = path + '/wq.svg';
        view.wq.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.wk.src = path + '/wk.svg';
        view.wk.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.bp.src = path + '/bp.svg';
        view.bp.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.br.src = path + '/br.svg';
        view.br.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.bn.src = path + '/bn.svg';
        view.bn.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.bb.src = path + '/bb.svg';
        view.bb.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.bq.src = path + '/bq.svg';
        view.bq.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        view.bk.src = path + '/bk.svg';
        view.bk.onload = function () {
            view.loaded_pieces += 1;
            if (view.loaded_pieces === 12) {
                view.takeSnapshot();
                callback();
            }
        };

        if (typeof config.square_uri_dark === 'string') {
            view.square_uri_dark.src = config.square_uri_dark;
            view.square_uri_dark.onload = function () {
                view.takeSnapshot();
            };
        }
        if (typeof config.square_uri_light === 'string') {
            view.square_uri_light.src = config.square_uri_light;
            view.square_uri_light.onload = function () {
                view.takeSnapshot();
            };
        }
    };

    // Immediately initialize the board when an instance is created.
    init();

};

}(CHESS);

;
window.CHESS = CHESS;